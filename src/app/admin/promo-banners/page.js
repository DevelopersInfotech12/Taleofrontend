"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls,
} from "../components/ui";
import PromoBannerFormModal from "../components/PromoBannerFormModal";

export default function PromoBannersPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchItems = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/promo-banners?includeInactive=true", token);
      setItems(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (b) => { setEditing(b); setModalOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/promo-banners/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Banner deleted");
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (b) => {
    try {
      const fd = new FormData();
      fd.append("isActive", String(!b.isActive));
      await apiFetch(`/promo-banners/${b._id}`, token, { method: "PUT", body: fd });
      setItems((list) => list.map((x) => (x._id === b._id ? { ...x, isActive: !b.isActive } : x)));
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setReordering(true);
    try {
      await apiFetch("/promo-banners/reorder", token, {
        method: "PUT",
        body: JSON.stringify({ order: next.map((b) => b._id) }),
      });
    } catch (err) {
      showToast(err.message, "error");
      fetchItems();
    } finally {
      setReordering(false);
    }
  };

  const activeCount = items.filter((b) => b.isActive).length;

  return (
    <>
      <PageHeader
        eyebrow="Homepage"
        title="Promo Banner Slider"
        action={<HeaderButton onClick={openCreate}>+ Add Banner</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Banners", value: items.length },
        { label: "Live", value: activeCount },
        { label: "Hidden", value: items.length - activeCount },
      ]} />

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : items.length === 0 ? (
          <EmptyState message="No banners yet — add one. Until then the homepage shows its built-in default slider (Under 30k / other seasonal banners)." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order", "Preview", "Link", "Status", "Actions"]} />
              <tbody>
                {items.map((b, i) => (
                  <tr key={b._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => move(i, -1)}
                          disabled={i === 0 || reordering}
                          className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >▲</button>
                        <button
                          onClick={() => move(i, 1)}
                          disabled={i === items.length - 1 || reordering}
                          className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >▼</button>
                      </div>
                    </AccentCell>

                    <td className="px-4 py-3">
                      <div className="w-28 h-16 rounded-md overflow-hidden border border-[#ede4d8] bg-[#1a0c06] flex items-center justify-center">
                        {b.image
                          ? <img src={imgUrl(b.image)} alt="" className="w-full h-full object-cover" />
                          : <span className="text-[9px] text-[#c9a84c]/60">none</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {b.href
                        ? <span className="text-[11px] text-[#5c4f42]">{b.href}</span>
                        : <span className="text-[12px] text-[#91806f] font-bold">Not clickable</span>}
                    </td>

                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(b)} className="scale-122 origin-left">
                        <Badge status={b.isActive ? "active" : "inactive"} label={b.isActive ? "Live" : "Hidden"} />
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(b)} className={`${editBtnCls} text-[12px]`}>Edit</button>
                        <button onClick={() => setDeleteTarget(b)} className={`${delBtnCls} text-[12px]`}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>

      <PromoBannerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        banner={editing}
        onSaved={fetchItems}
        showToast={showToast}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this banner?"
        message="It will be removed from the homepage slider."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
