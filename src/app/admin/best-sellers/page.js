"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtCurrency, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast,
  PageHeader, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls,
} from "../components/ui";
import ProductFormModal from "../components/ProductFormModal";

export default function BestSellersPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          apiFetch("/categories?includeInactive=true", token),
          apiFetch("/collections?includeInactive=true", token),
        ]);
        setCategories(catRes.data || []);
        setCollections(colRes.data || []);
      } catch { /* non-fatal */ }
    })();
  }, [token]);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10", sort: "popular", sold: "true" });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await apiFetch(`/products/admin?${params.toString()}`, token);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetFilters = () => { setSearchInput(""); setSearch(""); setCategory(""); setPage(1); };
  const openEdit = (p) => { setEditing(p); setModalOpen(true); };

  const unitsThisPage = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
  const revenueThisPage = products.reduce((sum, p) => sum + (p.soldCount || 0) * p.price, 0);

  return (
    <>
      <PageHeader eyebrow="Sales Performance" title="Best-Selling Products" />

      <StatStrip stats={[
        { label: "Bestsellers", value: total },
        { label: "This Page", value: products.length },
        { label: "Units Sold (page)", value: unitsThisPage },
        { label: "Revenue (page)", value: fmtCurrency(revenueThisPage) },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search</FilterLabel>
          <input className={filterInputCls} placeholder="Name or SKU…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Category</FilterLabel>
          <select className={filterSelectCls + " min-w-[150px] pr-8"} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : products.length === 0 ? <EmptyState message="No sales recorded yet" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["#", "Product", "Category", "Price", "Units Sold", "Revenue", "Stock Left", "Actions"]} />
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} className={rowCls}>
                    <td className="px-4 py-3 text-[#b0a090] font-poppins">{(page - 1) * 10 + i + 1}</td>
                    <AccentCell className="pl-1">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? <img src={imgUrl(p.images[0])} alt="" className="w-10 h-10 rounded object-cover border border-[#ede4d8]" /> : <div className="w-10 h-10 rounded bg-[#f0e8dc]" />}
                        <div className="min-w-0">
                          <p className="text-[#706152] font-[650] max-w-[190px] text-[12.5px] truncate">{p.name}</p>
                          {p.isBestseller && <Badge status="pending" label="Bestseller" />}
                        </div>
                      </div>
                    </AccentCell>
                    <td className="px-4 py-3 text-[#5c4f42]">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-[#1a1008] font-medium font-poppins">{fmtCurrency(p.price)}</td>
                    <td className="px-4 py-3 font-poppins font-semibold text-[#1a1008]">{p.soldCount || 0}</td>
                    <td className="px-4 py-3 font-poppins text-[#1a1008]">{fmtCurrency((p.soldCount || 0) * p.price)}</td>
                    <td className="px-4 py-3 font-poppins">
                      <span className={p.stock === 0 ? "text-red-600 font-medium" : p.stock < 10 ? "text-amber-600 font-medium" : "text-[#5c4f42]"}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(p)} className={editBtnCls}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} total={total} onChange={setPage} />
      </TableShell>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        categories={categories}
        collections={collections}
        onSaved={fetchProducts}
        showToast={showToast}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
