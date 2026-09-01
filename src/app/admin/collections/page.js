"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch, imgUrl, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls,
} from "../components/ui";
import CollectionFormModal from "../components/CollectionFormModal";

export default function CollectionsPage() {
  const { token } = useAuth();
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchCollections = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/collections?includeInactive=true", token);
      setCollections(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);

  useEffect(() => {
    if (!token) return;
    apiFetch("/categories?includeInactive=true", token).then(res => setCategories(res.data || [])).catch(() => { });
  }, [token]);

  const categoriesFor = (collId) => categories.filter(cat => (cat.collection?._id || cat.collection) === collId);

  const filtered = useMemo(() => {
    return collections.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.slug.toLowerCase().includes(search.toLowerCase())) return false;
      if (status === "active" && !c.isActive) return false;
      if (status === "inactive" && c.isActive) return false;
      if (featured === "yes" && !c.isFeatured) return false;
      if (featured === "no" && c.isFeatured) return false;
      return true;
    });
  }, [collections, search, status, featured]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setModalOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/collections/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Collection deleted");
      setDeleteTarget(null);
      fetchCollections();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => { setSearch(""); setStatus(""); setFeatured(""); };

  const active = collections.filter(c => c.isActive).length;
  const featuredCount = collections.filter(c => c.isFeatured).length;

  return (
    <>
      <PageHeader
        eyebrow="Catalog Management"
        title="Collections"
        action={<HeaderButton onClick={openCreate}>+ Add Collection</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Total", value: collections.length },
        { label: "Active", value: active },
        { label: "Featured", value: featuredCount },
        { label: "Showing", value: filtered.length },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px] text-[13px]">
          <FilterLabel>Search</FilterLabel>
          <input className={`${filterInputCls} text-[13px]`} placeholder="Name or slug…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="text-[13px]">
          <FilterLabel>Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px] text-[13px]"} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="text-[13px]">
          <FilterLabel>Featured</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px] text-[13px]"} value={featured} onChange={e => setFeatured(e.target.value)}>
            <option value="">All</option>
            <option value="yes">Featured</option>
            <option value="no">Not Featured</option>
          </select>
        </div>
        <div className="text-[13px]">
          <ResetButton onClick={resetFilters} />
        </div>
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState message="No collections found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <Thead headers={["Collection", "Slug", "Categories", "Tags", "Sort", "Featured", "Status", "Created", "Actions"]} />
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-3">
                        {c.image ? <img src={imgUrl(c.image)} alt="" className="w-10 h-10 rounded object-cover border border-[#ede4d8]" /> : <div className="w-10 h-10 rounded bg-[#f0e8dc]" />}
                        <p className="text-[#1a1008] font-semibold text-[13.5px]">{c.name}</p>
                      </div>
                    </AccentCell>
                    <td className="px-4 py-3 font-poppins text-[12px] text-[#9c8a78]">{c.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {categoriesFor(c._id).length === 0 ? <span className="text-[#9c8a78]">—</span> :
                          categoriesFor(c._id).slice(0, 3).map(cat => (
                            <span key={cat._id} className="text-[11px] px-1.5 py-0.5 rounded bg-[#f0e8dc] text-[#8b6914]">{cat.name}</span>
                          ))}
                        {categoriesFor(c._id).length > 3 && <span className="text-[11px] text-[#9c8a78]">+{categoriesFor(c._id).length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {(c.tags || []).slice(0, 3).map(t => <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-[#f0e8dc] text-[#5c4f42]">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#5c4f42]">{c.sortOrder}</td>
                    <td className="px-4 py-3">
                      {c.isFeatured ? <div className="scale-110 origin-left inline-block"><Badge status="active" label="Featured" /></div> : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="scale-110 origin-left inline-block">
                        <Badge status={c.isActive ? "active" : "inactive"} label={c.isActive ? "Active" : "Inactive"} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#9c8a78]">{fmtDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(c)} className={`${editBtnCls} text-[13px]`}>Edit</button>
                        <button onClick={() => setDeleteTarget(c)} className={`${delBtnCls} text-[13px]`}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>

      <CollectionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        collection={editing}
        onSaved={fetchCollections}
        showToast={showToast}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete collection?"
        message={`"${deleteTarget?.name}" will be permanently deleted.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}