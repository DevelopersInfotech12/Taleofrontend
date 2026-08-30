"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Toast, ConfirmDialog,
  PageHeader, StatStrip, Field, inputCls, PrimaryButton,
} from "../components/ui";

const emptyForm = {
  eyebrow: "",
  headingMain: "",
  headingAccent: "",
  buttonLabel: "",
  buttonHref: "",
};

export default function HeritagePage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [savingText, setSavingText] = useState(false);

  const [images, setImages] = useState([]);
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [newFile, setNewFile] = useState(null);
  const [newAlt, setNewAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/heritage", token);
      const doc = res.data;
      if (doc) {
        setForm({
          eyebrow: doc.eyebrow || "",
          headingMain: doc.headingMain || "",
          headingAccent: doc.headingAccent || "",
          buttonLabel: doc.buttonLabel || "",
          buttonHref: doc.buttonHref || "",
        });
        setImages([...(doc.images || [])].sort((a, b) => a.sortOrder - b.sortOrder));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const saveText = async (e) => {
    e.preventDefault();
    setSavingText(true);
    try {
      await apiFetch("/heritage", token, { method: "PUT", body: JSON.stringify(form) });
      showToast("Section text updated");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingText(false);
    }
  };

  const addImage = async (e) => {
    e.preventDefault();
    if (!newFile) { showToast("Choose an image file first", "error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", newFile);
      fd.append("alt", newAlt);
      const res = await apiFetch("/heritage/images", token, { method: "POST", body: fd });
      setImages([...(res.data.images || [])].sort((a, b) => a.sortOrder - b.sortOrder));
      setNewFile(null);
      setNewAlt("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("Image added");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await apiFetch(`/heritage/images/${deleteTarget._id}`, token, { method: "DELETE" });
      setImages([...(res.data.images || [])].sort((a, b) => a.sortOrder - b.sortOrder));
      showToast("Image deleted");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    setReordering(true);
    try {
      await apiFetch("/heritage/images/reorder", token, {
        method: "PUT",
        body: JSON.stringify({ order: next.map((im) => im._id) }),
      });
    } catch (err) {
      showToast(err.message, "error");
      fetchData();
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Homepage" title="Heritage Craft" />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Homepage" title="Heritage Craft" />

      <StatStrip stats={[
        { label: "Gallery Images", value: images.length },
        { label: "Columns Used", value: Math.min(images.length, 4) },
      ]} />

      <ErrorBanner message={error} />

      {/* ── Copy settings ── */}
      <div className="bg-white rounded-xl border border-[#ede4d8] p-5 mb-6" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78] mb-4">Section Copy</h2>
        <form onSubmit={saveText} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow Tag">
              <input className={inputCls} value={form.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} placeholder="Heritage Craft" />
            </Field>
            <Field label="Button Label">
              <input className={inputCls} value={form.buttonLabel} onChange={(e) => update("buttonLabel", e.target.value)} placeholder="Explore Now" />
            </Field>
            <Field label="Heading — main part">
              <input className={inputCls} value={form.headingMain} onChange={(e) => update("headingMain", e.target.value)} placeholder="Masterfully" />
            </Field>
            <Field label="Heading — accent part (italic, gold)">
              <input className={inputCls} value={form.headingAccent} onChange={(e) => update("headingAccent", e.target.value)} placeholder="crafted in India." />
            </Field>
            <Field label="Button Link" span>
              <input className={inputCls} value={form.buttonHref} onChange={(e) => update("buttonHref", e.target.value)} placeholder="/products" />
            </Field>
          </div>
          <div className="flex justify-end pt-2 border-t border-[#ede4d8]">
            <PrimaryButton type="submit" disabled={savingText}>
              {savingText ? "Saving…" : "Save Text"}
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* ── Image gallery ── */}
      <div className="bg-white rounded-xl border border-[#ede4d8] p-5" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78]">Gallery Images</h2>
        </div>

        <p className="text-[11px] text-[#b0a090] mb-4 leading-relaxed">
          These photos auto-fill the four scrolling columns in order — shows immediately, even with
          just 1 image (it repeats until you add more). Add 4+ for unique content per column.
        </p>

        {/* Add image */}
        <form onSubmit={addImage} className="flex flex-wrap items-end gap-3 mb-6 p-4 rounded-lg bg-[#fdfaf6] border border-[#ede4d8]">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Image File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
              className="text-[12px] text-[#5c4f42] w-full"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <Field label="Alt Text (optional)">
              <input className={inputCls} value={newAlt} onChange={(e) => setNewAlt(e.target.value)} placeholder="e.g. Gold cuff bracelet" />
            </Field>
          </div>
          <PrimaryButton type="submit" disabled={uploading}>
            {uploading ? "Uploading…" : "+ Add Image"}
          </PrimaryButton>
        </form>

        {images.length === 0 ? (
          <EmptyState message="No gallery images yet — add some above. Until then the homepage shows its built-in default gallery." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={img._id} className="rounded-lg overflow-hidden border border-[#ede4d8] bg-[#fdfaf6]">
                <div className="w-full aspect-[4/3] bg-[#1a0c06]">
                  <img src={imgUrl(img.url)} alt={img.alt || ""} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5">
                  <p className="text-[10px] text-[#9c8a78] mb-2 truncate" title={img.alt}>
                    {img.alt || <span className="italic text-[#c9bba8]">No alt text</span>}
                  </p>
                  <p className="text-[9px] text-[#c9a84c] uppercase tracking-widest mb-2">
                    Column {(i % 4) + 1}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0 || reordering}
                        className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed text-[12px]"
                        title="Move earlier"
                      >▲</button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === images.length - 1 || reordering}
                        className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed text-[12px]"
                        title="Move later"
                      >▼</button>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(img)}
                      className="text-[10.5px] font-bold text-[#d4756a] hover:text-[#a34030] uppercase tracking-[0.12em] transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this image?"
        message="It will be removed from the homepage gallery."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
