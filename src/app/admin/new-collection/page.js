"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, Toast,
  PageHeader, Field, inputCls, PrimaryButton,
} from "../components/ui";

const DEFAULTS = {
  imageAlt: "Eternal Beauty jewellery",
  eyebrow: "New Collection · 2025",
  headingMain: "Eternal",
  headingAccent: "Beauty.",
  body:
    "Each piece cast in 22k chocolate gold, stone-set by hand in batches of forty. Created in limited numbers to preserve exclusivity and craftsmanship. Every detail is meticulously finished by skilled artisans, ensuring exceptional quality. Designed to be treasured today and passed down for generations.",
  primaryButtonLabel: "Discover Now",
  primaryButtonHref: "/collections/eternal-beauty",
  secondaryButtonLabel: "Browse all →",
  secondaryButtonHref: "/collections",
};
const DEFAULT_PILLS = ["22k Gold", "Hand-set stones", "40 pieces only"];
const FALLBACK_IMAGE = "/banner10.png";

export default function NewCollectionPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(DEFAULTS);
  const [pills, setPills] = useState(DEFAULT_PILLS);
  const [savedImage, setSavedImage] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const applyDoc = (doc) => {
    if (!doc) return;
    setForm({
      imageAlt: doc.imageAlt ?? DEFAULTS.imageAlt,
      eyebrow: doc.eyebrow ?? DEFAULTS.eyebrow,
      headingMain: doc.headingMain ?? DEFAULTS.headingMain,
      headingAccent: doc.headingAccent ?? DEFAULTS.headingAccent,
      body: doc.body ?? DEFAULTS.body,
      primaryButtonLabel: doc.primaryButtonLabel ?? DEFAULTS.primaryButtonLabel,
      primaryButtonHref: doc.primaryButtonHref ?? DEFAULTS.primaryButtonHref,
      secondaryButtonLabel: doc.secondaryButtonLabel ?? DEFAULTS.secondaryButtonLabel,
      secondaryButtonHref: doc.secondaryButtonHref ?? DEFAULTS.secondaryButtonHref,
    });
    setPills(Array.isArray(doc.pills) ? doc.pills : DEFAULT_PILLS);
    setSavedImage(doc.image || "");
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/new-collection", token);
      applyDoc(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!newFile) { setPreview(""); return; }
    const url = URL.createObjectURL(newFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [newFile]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updatePill = (i, v) => setPills((p) => p.map((x, idx) => (idx === i ? v : x)));
  const removePill = (i) => setPills((p) => p.filter((_, idx) => idx !== i));
  const addPill = () => setPills((p) => [...p, ""]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("pills", JSON.stringify(pills.map((p) => p.trim()).filter(Boolean)));
      if (newFile) fd.append("image", newFile);
      else if (removeImage) fd.append("removeImage", "true");

      const res = await apiFetch("/new-collection", token, { method: "PUT", body: fd });
      applyDoc(res.data);
      setNewFile(null);
      setRemoveImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("New collection section updated");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Homepage" title="New Collection" />
        <Spinner />
      </>
    );
  }

  const shownImage = preview || (removeImage ? FALLBACK_IMAGE : savedImage ? imgUrl(savedImage) : FALLBACK_IMAGE);

  return (
    <>
      <PageHeader
        eyebrow="Homepage"
        title="Eternal Beauty"
        subtitle="Edit the “Eternal Beauty” section shown on the homepage."
      />
      <ErrorBanner message={error} />

      <form onSubmit={save} className="space-y-6">
        {/* ── Image ── */}
        <div className="bg-white rounded-xl border border-[#ede4d8] p-5" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78] mb-4">Section Image</h2>
          <div className="flex flex-wrap gap-5 items-start">
            <div className="w-[200px] aspect-[4/5] rounded-lg overflow-hidden border border-[#ede4d8] bg-[#1a0c06] shrink-0">
              <img src={shownImage} alt={form.imageAlt} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-[220px] space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Replace Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => { setNewFile(e.target.files?.[0] || null); setRemoveImage(false); }}
                  className="text-[12px] text-[#5c4f42] w-full"
                />
                <p className="text-[11px] text-[#b0a090] mt-1.5">
                  {newFile ? "New image selected — click Save to apply." : "Leave empty to keep the current image."}
                </p>
              </div>
              <Field label="Image Alt Text">
                <input className={inputCls} value={form.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} />
              </Field>
              {(savedImage || newFile) && (
                <button
                  type="button"
                  onClick={() => {
                    setNewFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    if (savedImage) setRemoveImage(true);
                  }}
                  className="text-[10.5px] font-bold text-[#d4756a] hover:text-[#a34030] uppercase tracking-[0.12em] transition-colors"
                >
                  {newFile ? "Cancel new image" : "Revert to default image"}
                </button>
              )}
              {removeImage && <p className="text-[11px] text-[#b0a090]">Default image will be restored on Save.</p>}
            </div>
          </div>
        </div>

        {/* ── Copy ── */}
        <div className="bg-white rounded-xl border border-[#ede4d8] p-5" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78] mb-4">Section Copy</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow Tag" span>
              <input className={inputCls} value={form.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} placeholder="New Collection · 2025" />
            </Field>
            <Field label="Heading — main part (bold)">
              <input className={inputCls} value={form.headingMain} onChange={(e) => update("headingMain", e.target.value)} placeholder="Eternal" />
            </Field>
            <Field label="Heading — accent part (italic, gold)">
              <input className={inputCls} value={form.headingAccent} onChange={(e) => update("headingAccent", e.target.value)} placeholder="Beauty." />
            </Field>
            <Field label="Description" span>
              <textarea className={inputCls} rows={5} value={form.body} onChange={(e) => update("body", e.target.value)} />
            </Field>
          </div>
        </div>

        {/* ── Pills ── */}
        <div className="bg-white rounded-xl border border-[#ede4d8] p-5" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78]">Tags</h2>
            <button type="button" onClick={addPill} className="text-[10.5px] font-bold text-[#c9a84c] hover:text-[#8b6914] uppercase tracking-[0.12em] transition-colors">
              + Add Tag
            </button>
          </div>
          {pills.length === 0 && <p className="text-[12px] text-[#b0a090]">No tags — none will show on the homepage.</p>}
          <div className="space-y-2">
            {pills.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <input className={inputCls} value={p} onChange={(e) => updatePill(i, e.target.value)} placeholder="e.g. 22k Gold" />
                <button
                  type="button"
                  onClick={() => removePill(i)}
                  className="text-[10.5px] font-bold text-[#d4756a] hover:text-[#a34030] uppercase tracking-[0.12em] transition-colors shrink-0"
                >
                  Del
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="bg-white rounded-xl border border-[#ede4d8] p-5" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78] mb-4">Buttons</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Button Label">
              <input className={inputCls} value={form.primaryButtonLabel} onChange={(e) => update("primaryButtonLabel", e.target.value)} placeholder="Discover Now" />
            </Field>
            <Field label="Primary Button Link">
              <input className={inputCls} value={form.primaryButtonHref} onChange={(e) => update("primaryButtonHref", e.target.value)} placeholder="/collections/eternal-beauty" />
            </Field>
            <Field label="Secondary Button Label">
              <input className={inputCls} value={form.secondaryButtonLabel} onChange={(e) => update("secondaryButtonLabel", e.target.value)} placeholder="Browse all →" />
            </Field>
            <Field label="Secondary Button Link">
              <input className={inputCls} value={form.secondaryButtonHref} onChange={(e) => update("secondaryButtonHref", e.target.value)} placeholder="/collections" />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </PrimaryButton>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
