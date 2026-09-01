"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch, fmtCurrency, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast,
  PageHeader, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls,
} from "../components/ui";
import ProductFormModal from "../components/ProductFormModal";

export default function OutOfStockPage() {
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
  const [sort, setSort] = useState("newest");

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
      const params = new URLSearchParams({ page: String(page), limit: "10", sort, stock: "out" });
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
  }, [token, page, search, category, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetFilters = () => { setSearchInput(""); setSearch(""); setCategory(""); setSort("newest"); setPage(1); };
  const openEdit = (p) => { setEditing(p); setModalOpen(true); };

  const categoriesAffected = useMemo(
    () => new Set(products.map(p => p.category?._id || p.category).filter(Boolean)).size,
    [products]
  );

  return (
    <>
      <PageHeader eyebrow="Inventory Alerts" title="Out of Stock Products" />

      <StatStrip stats={[
        { label: "Total Out of Stock", value: total },
        { label: "This Page", value: products.length },
        { label: "Categories Affected", value: categoriesAffected },
        { label: "Status", value: "0 units" },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px] text-[13px]">
          <FilterLabel>Search</FilterLabel>
          <input className={`${filterInputCls} text-[13px]`} placeholder="Name or SKU…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div className="text-[13px]">
          <FilterLabel>Category</FilterLabel>
          <select className={filterSelectCls + " min-w-[150px] pr-8 text-[13px]"} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="text-[13px]">
          <FilterLabel>Sort</FilterLabel>
          <select className={filterSelectCls + " min-w-[160px] pr-8 text-[13px]"} value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="popular">Most Sold (before running out)</option>
          </select>
        </div>
        <div className="text-[13px]">
          <ResetButton onClick={resetFilters} />
        </div>
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : products.length === 0 ? <EmptyState message="Nothing is out of stock right now" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <Thead headers={["Product", "Category", "Price", "Stock", "Status", "SKU", "Actions"]} />
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? <img src={imgUrl(p.images[0])} alt="" className="w-10 h-10 rounded object-cover border border-[#ede4d8]" /> : <div className="w-10 h-10 rounded bg-[#f0e8dc]" />}
                        <p className="text-[#706152] font-[650] max-w-[190px] text-[13.5px] truncate">{p.name}</p>
                      </div>
                    </AccentCell>
                    <td className="px-4 py-3 text-[#5c4f42]">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-[#1a1008] font-medium font-poppins">{fmtCurrency(p.price)}</td>
                    <td className="px-4 py-3 font-poppins text-red-600 font-semibold">0</td>
                    <td className="px-4 py-3">
                      <div className="scale-110 origin-left inline-block">
                        <Badge status={p.isActive ? "cancelled" : "inactive"} label={p.isActive ? "Out of Stock" : "Inactive"} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#9c8a78]">{p.sku || "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(p)} className={`${editBtnCls} text-[13px]`}>Restock</button>
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