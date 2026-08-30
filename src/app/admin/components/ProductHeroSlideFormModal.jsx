"use client";
import { useState, useEffect, useRef } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = {
  collection: "",
  heading: "",
  meta: "",
  description: "",
  ctaLabel: "",
  ctaHref: "/products",
  isActive: true,
};

/** Single image picker with preview + remove. */
function ImagePicker({ label, hint, existing, file, onFile, onClear }) {
  const inputRef = useRef(null);
  const preview = file ? URL.createObjectURL(file) : existing ? imgUrl(existing) : "";

  useEffect(() => {
    return () => { if (file) URL.revokeObjectURL(preview); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">{label}</label>
      <div className="flex items-start gap-3">
        <div className="w-28 h-20 rounded-lg overflow-hidden border border-[#e0d4c4] bg-[#fdfaf6] flex items-center justify-center shrink-0">
          {preview
            ? <img src={preview} alt="" className="w-full h-full object-cover" />
            : <span className="text-[10px] text-[#b0a090] text-center px-2">No image</span>}
        </div>
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
            className="text-[12px] text-[#5c4f42] w-full"
          />
          <p className="text-[10px] text-[#b0a090] mt-1.5 leading-relaxed">{hint}</p>
          {preview && (
            <button
              type="button"
              onClick={() => { onClear(); if (inputRef.current) inputRef.current.value = ""; }}
              className="text-[10px] text-red-500 hover:text-red-700 mt-1 uppercase tracking-widest"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductHeroSlideFormModal({ open, onClose, slide, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState("");
  const [existingMobile, setExistingMobile] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slide) {
      setForm({
        collection: slide.collection || "",
        heading: slide.heading || "",
        meta: slide.meta || "",
        description: slide.description || "",
        ctaLabel: slide.ctaLabel || "",
        ctaHref: slide.ctaHref || "/products",
        isActive: slide.isActive !== false,
      });
      setExistingImage(slide.image || "");
      setExistingMobile(slide.mobileImage || "");
    } else {
      setForm(emptyForm);
      setExistingImage("");
      setExistingMobile("");
    }
    setImageFile(null);
    setMobileFile(null);
    setError("");
  }, [slide, open]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.heading.trim()) { setError("Heading is required"); return; }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      // Preserve / clear existing URLs when no new file is chosen
      fd.append("keepImage", imageFile ? "" : existingImage);
      fd.append("keepMobileImage", mobileFile ? "" : existingMobile);

      if (imageFile) fd.append("image", imageFile);
      if (mobileFile) fd.append("mobileImage", mobileFile);

      if (slide) {
        await apiFetch(`/product-hero/${slide._id}`, token, { method: "PUT", body: fd });
        showToast("Slide updated");
      } else {
        await apiFetch("/product-hero", token, { method: "POST", body: fd });
        showToast("Slide created");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={slide ? "Edit Products Hero Slide" : "Add Products Hero Slide"} width="max-w-3xl">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-5">

        {/* Copy */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Collection Tag">
            <input className={inputCls} value={form.collection} onChange={(e) => update("collection", e.target.value)} placeholder="e.g. Necklaces" />
          </Field>
          <Field label="Meta Line (under heading)">
            <input className={inputCls} value={form.meta} onChange={(e) => update("meta", e.target.value)} placeholder="e.g. Necklaces · Hand-forged in 22k" />
          </Field>
          <Field label="Heading (big headline)" span>
            <textarea rows={2} className={inputCls} value={form.heading} onChange={(e) => update("heading", e.target.value)} placeholder={"The Art\\nof Gold — use a line break for two lines"} />
            <p className="text-[10px] text-[#b0a090] mt-1">Press Enter for a two-line heading, e.g. "The Art" / "of Gold".</p>
          </Field>
          <Field label="Description Paragraph" span>
            <textarea rows={3} className={inputCls} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>
          <Field label="Button Label">
            <input className={inputCls} value={form.ctaLabel} onChange={(e) => update("ctaLabel", e.target.value)} placeholder="Explore Necklaces" />
          </Field>
          <Field label="Button Link">
            <input className={inputCls} value={form.ctaHref} onChange={(e) => update("ctaHref", e.target.value)} placeholder="/necklaces" />
          </Field>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <ImagePicker
            label="Desktop Image"
            hint="Wide landscape, ideally 1600×900. Shown on screens ≥768px."
            existing={existingImage}
            file={imageFile}
            onFile={setImageFile}
            onClear={() => { setImageFile(null); setExistingImage(""); }}
          />
          <ImagePicker
            label="Mobile Image"
            hint="Falls back to the desktop image if left blank."
            existing={existingMobile}
            file={mobileFile}
            onFile={setMobileFile}
            onClear={() => { setMobileFile(null); setExistingMobile(""); }}
          />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-5 pt-1">
          <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
            Active (visible on site)
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Saving…" : slide ? "Save Changes" : "Create Slide"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
