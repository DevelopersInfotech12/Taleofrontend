"use client";
import { useState, useEffect, useRef } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = { href: "", alt: "", isActive: true };

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

export default function PromoBannerFormModal({ open, onClose, banner, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState("");
  const [existingMobile, setExistingMobile] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (banner) {
      setForm({
        href: banner.href || "",
        alt: banner.alt || "",
        isActive: banner.isActive !== false,
      });
      setExistingImage(banner.image || "");
      setExistingMobile(banner.mobileImage || "");
    } else {
      setForm(emptyForm);
      setExistingImage("");
      setExistingMobile("");
    }
    setImageFile(null);
    setMobileFile(null);
    setError("");
  }, [banner, open]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!imageFile && !existingImage) { setError("A desktop image is required"); return; }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("keepImage", imageFile ? "" : existingImage);
      fd.append("keepMobileImage", mobileFile ? "" : existingMobile);
      if (imageFile) fd.append("image", imageFile);
      if (mobileFile) fd.append("mobileImage", mobileFile);

      if (banner) {
        await apiFetch(`/promo-banners/${banner._id}`, token, { method: "PUT", body: fd });
        showToast("Banner updated");
      } else {
        await apiFetch("/promo-banners", token, { method: "POST", body: fd });
        showToast("Banner created");
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
    <Modal open={open} onClose={onClose} title={banner ? "Edit Promo Banner" : "Add Promo Banner"} width="max-w-2xl">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ImagePicker
            label="Desktop Image"
            hint="Wide banner, ideally 1600×520. All text is baked into the image itself."
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="Click-through Link (optional)">
            <input className={inputCls} value={form.href} onChange={(e) => update("href", e.target.value)} placeholder="/products?tag=under-30k" />
          </Field>
          <Field label="Alt Text">
            <input className={inputCls} value={form.alt} onChange={(e) => update("alt", e.target.value)} placeholder="Under 30k diamond edit" />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
          Active (visible on site)
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Saving…" : banner ? "Save Changes" : "Create Banner"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
