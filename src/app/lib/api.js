// Frontend API client — single source of truth
// All pages use these helpers instead of static mock data

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function imgUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API.replace("/api/v1", "")}${path}`;
}

export function fmtPrice(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const res = await fetch(`${API}/products?${qs}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json(); // { success, data: { products, total, page, pages } }
}

export async function fetchProductBySlug(slug) {
  const res = await fetch(`${API}/products/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export async function fetchFeaturedProducts(limit = 4) {
  try {
    const json = await fetchProducts({ featured: true, limit });
    return json.data?.products ?? [];
  } catch {
    return [];
  }
}

export async function fetchNewArrivals(limit = 8) {
  try {
    const json = await fetchProducts({ newArrival: true, limit });
    return json.data?.products ?? [];
  } catch {
    return [];
  }
}

export async function fetchBestsellers(limit = 8) {
  try {
    const json = await fetchProducts({ bestseller: true, limit });
    return json.data?.products ?? [];
  } catch {
    return [];
  }
}

// ── Collections ──────────────────────────────────────────────────────────────

export async function fetchCollections(limit) {
  try {
    const res = await fetch(`${API}/collections`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const cols = json.data ?? [];
    return typeof limit === "number" ? cols.slice(0, limit) : cols;
  } catch {
    return [];
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function fetchCategories() {
  try {
    const res = await fetch(`${API}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

// ── normaliseProduct ──────────────────────────────────────────────────────────
// Maps backend Product doc → shape expected by ProductCard / ProductView

export function normaliseProduct(p) {
  if (!p) return null;
  const badge = p.isBestseller
    ? "Bestseller"
    : p.isNewArrival
    ? "New"
    : p.comparePrice > 0 && p.comparePrice > p.price
    ? "Sale"
    : null;

  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name ?? p.category ?? "",
    description: p.description ?? p.shortDesc ?? "",
    shortDesc: p.shortDesc ?? "",
    price: p.price,
    originalPrice: p.comparePrice > 0 ? p.comparePrice : null,
    rating: p.avgRating ?? 0,
    reviews: p.reviewCount ?? 0,
    badge,
    badgeColor: badge === "Bestseller" ? "#c9a96e" : badge === "New" ? "#8fbc8b" : badge === "Sale" ? "#e07c5a" : null,
    image: imgUrl(p.images?.[0]),
    images: (p.images ?? []).map(imgUrl),
    variants: (p.variants ?? []).map((v) => v.label ?? v),
    material: p.material ?? "",
    sku: p.sku ?? "",
    stock: p.stock ?? 0,
    tags: p.tags ?? [],
    isFeatured: p.isFeatured,
    isNewArrival: p.isNewArrival,
    isBestseller: p.isBestseller,
    details: [
      p.material && p.material,
      p.sku && `SKU: ${p.sku}`,
    ].filter(Boolean),
  };
}

// ── Invoice download ─────────────────────────────────────────────────────────
// Fetches the invoice PDF (auth required) and triggers a browser download.
export async function downloadInvoice(orderId, orderNumber) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const res = await fetch(`${API}/orders/my/${orderId}/invoice`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    let message = `Failed to download invoice (${res.status})`;
    try {
      const json = await res.json();
      message = json?.message || message;
    } catch {}
    throw new Error(message);
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${orderNumber || orderId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
