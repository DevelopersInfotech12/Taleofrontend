"use client";
import { useState, useEffect, useRef } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = { name: "", slug: "", description: "", tags: "", sortOrder: 0, isFeatured: false, isActive: true };

/** Single image picker with preview + remove (shown on homepage "New chapters to explore" tile). */
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
        <div className="w-20 h-24 rounded-lg overflow-hidden border border-[#e0d4c4] bg-[#fdfaf6] flex items-center justify-center shrink-0">
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
          {hint && <p className="text-[10px] text-[#b0a090] mt-1.5 leading-relaxed">{hint}</p>}
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

export default function CollectionFormModal({ open, onClose, collection, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (collection) {
      setForm({
        name: collection.name || "",
        slug: collection.slug || "",
        description: collection.description || "",
        tags: (collection.tags || []).join(", "),
        sortOrder: collection.sortOrder ?? 0,
        isFeatured: !!collection.isFeatured,
        isActive: collection.isActive !== false,
      });
      setExistingImage(collection.image || "");
    } else {
      setForm(emptyForm);
      setExistingImage("");
    }
    setImageFile(null);
    setError("");
  }, [collection, open]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.slug) fd.append("slug", form.slug);
      fd.append("description", form.description);
      const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
      tagsArr.forEach(t => fd.append("tags", t));
      fd.append("sortOrder", form.sortOrder);
      fd.append("isFeatured", form.isFeatured);
      fd.append("isActive", form.isActive);
      if (imageFile) fd.append("image", imageFile);

      if (collection) {
        await apiFetch(`/collections/${collection._id}`, token, { method: "PUT", body: fd });
        showToast("Collection updated");
      } else {
        await apiFetch("/collections", token, { method: "POST", body: fd });
        showToast("Collection created");
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
    <Modal open={open} onClose={onClose} title={collection ? "Edit Collection" : "Add Collection"} width="max-w-lg">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name">
          <input required className={inputCls} value={form.name} onChange={e => update("name", e.target.value)} />
        </Field>
        <Field label="Slug (optional)">
          <input className={inputCls} value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="auto-generated" />
        </Field>
        <ImagePicker
          label="Tile Image"
          hint="Shown on the homepage “New chapters to explore” section."
          existing={existingImage}
          file={imageFile}
          onFile={(f) => setImageFile(f)}
          onClear={() => { setImageFile(null); setExistingImage(""); }}
        />
        <Field label="Description">
          <textarea rows={2} className={inputCls} value={form.description} onChange={e => update("description", e.target.value)} />
        </Field>
        <Field label="Tags (comma separated)">
          <input className={inputCls} value={form.tags} onChange={e => update("tags", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Featured">
            <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer mt-2.5">
              <input type="checkbox" checked={form.isFeatured} onChange={e => update("isFeatured", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              Featured
            </label>
          </Field>
          <Field label="Status">
            <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer mt-2.5">
              <input type="checkbox" checked={form.isActive} onChange={e => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              Active
            </label>
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : (collection ? "Save Changes" : "Create Collection")}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
