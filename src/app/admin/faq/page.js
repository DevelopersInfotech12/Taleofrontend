"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Toast, ConfirmDialog,
  PageHeader, StatStrip, Field, inputCls, PrimaryButton, SecondaryButton,
} from "../components/ui";

const emptyForm = {
  eyebrow: "",
  headingMain: "",
  headingAccent: "",
  subtitle: "",
  badgeText: "",
};

/** One FAQ row — read mode by default, flips into an inline edit form. */
function FaqRow({ item, index, total, onSave, onDelete, onMove, reordering }) {
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(item.question);
  const [a, setA] = useState(item.answer);
  const [saving, setSaving] = useState(false);

  const cancel = () => { setQ(item.question); setA(item.answer); setEditing(false); };

  const save = async () => {
    if (!q.trim() || !a.trim()) return;
    setSaving(true);
    try {
      await onSave(item._id, q, a);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="p-4 rounded-lg border border-[#c9a84c]/40 bg-[#fdfaf6] space-y-3">
        <Field label="Question">
          <input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} />
        </Field>
        <Field label="Answer">
          <textarea rows={3} className={inputCls} value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2">
          <SecondaryButton type="button" onClick={cancel}>Cancel</SecondaryButton>
          <PrimaryButton type="button" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border border-[#ede4d8] bg-white flex items-start gap-3">
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <button
          onClick={() => onMove(index, -1)}
          disabled={index === 0 || reordering}
          className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed text-[12px]"
          title="Move up"
        >▲</button>
        <button
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1 || reordering}
          className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed text-[12px]"
          title="Move down"
        >▼</button>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#1a1008]">{item.question}</p>
        <p className="text-[12px] text-[#7a6a5a] mt-1 leading-relaxed">{item.answer}</p>
      </div>

      <div className="flex gap-3 shrink-0 pt-0.5">
        <button onClick={() => setEditing(true)} className="text-[10.5px] font-bold text-[#c9a84c] hover:text-[#8b6914] uppercase tracking-[0.12em]">Edit</button>
        <button onClick={() => onDelete(item)} className="text-[10.5px] font-bold text-[#d4756a] hover:text-[#a34030] uppercase tracking-[0.12em]">Del</button>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [savingText, setSavingText] = useState(false);
  const fileInputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [adding, setAdding] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/faq", token);
      const doc = res.data;
      if (doc) {
        setForm({
          eyebrow: doc.eyebrow || "",
          headingMain: doc.headingMain || "",
          headingAccent: doc.headingAccent || "",
          subtitle: doc.subtitle || "",
          badgeText: doc.badgeText || "",
        });
        setExistingImage(doc.image || "");
        setItems([...(doc.items || [])].sort((a, b) => a.sortOrder - b.sortOrder));
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
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("keepImage", imageFile ? "" : existingImage);
      if (imageFile) fd.append("image", imageFile);
      const res = await apiFetch("/faq", token, { method: "PUT", body: fd });
      setExistingImage(res.data.image || "");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("Section updated");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSavingText(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) { showToast("Question and answer are required", "error"); return; }
    setAdding(true);
    try {
      const res = await apiFetch("/faq/items", token, {
        method: "POST",
        body: JSON.stringify({ question: newQ, answer: newA }),
      });
      setItems([...(res.data.items || [])].sort((a, b) => a.sortOrder - b.sortOrder));
      setNewQ("");
      setNewA("");
      showToast("FAQ added");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const saveItem = async (itemId, question, answer) => {
    try {
      const res = await apiFetch(`/faq/items/${itemId}`, token, {
        method: "PUT",
        body: JSON.stringify({ question, answer }),
      });
      setItems([...(res.data.items || [])].sort((a, b) => a.sortOrder - b.sortOrder));
      showToast("FAQ updated");
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await apiFetch(`/faq/items/${deleteTarget._id}`, token, { method: "DELETE" });
      setItems([...(res.data.items || [])].sort((a, b) => a.sortOrder - b.sortOrder));
      showToast("FAQ deleted");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
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
      await apiFetch("/faq/items/reorder", token, {
        method: "PUT",
        body: JSON.stringify({ order: next.map((it) => it._id) }),
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
        <PageHeader eyebrow="Homepage" title="FAQ Section" />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Homepage" title="FAQ Section" />

      <StatStrip stats={[{ label: "Questions", value: items.length }]} />

      <ErrorBanner message={error} />

      {/* ── Copy + image settings ── */}
      <div className="bg-white rounded-xl border border-[#ede4d8] p-5 mb-6" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78] mb-4">Section Copy</h2>
        <form onSubmit={saveText} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow Tag">
              <input className={inputCls} value={form.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} placeholder="Got Questions" />
            </Field>
            <Field label="Badge Text (on photo)">
              <input className={inputCls} value={form.badgeText} onChange={(e) => update("badgeText", e.target.value)} placeholder="Doubts? Ask TALEO." />
            </Field>
            <Field label="Heading — main part">
              <input className={inputCls} value={form.headingMain} onChange={(e) => update("headingMain", e.target.value)} placeholder="Frequently" />
            </Field>
            <Field label="Heading — accent part (italic, gold)">
              <input className={inputCls} value={form.headingAccent} onChange={(e) => update("headingAccent", e.target.value)} placeholder="asked" />
            </Field>
            <Field label="Subtitle" span>
              <input className={inputCls} value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} placeholder="Everything you need to know before your purchase." />
            </Field>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Side Photo</label>
            <div className="flex items-start gap-3">
              <div className="w-28 h-20 rounded-lg overflow-hidden border border-[#e0d4c4] bg-[#fdfaf6] flex items-center justify-center shrink-0">
                {(imageFile ? URL.createObjectURL(imageFile) : imgUrl(existingImage)) ? (
                  <img src={imageFile ? URL.createObjectURL(imageFile) : imgUrl(existingImage)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-[#b0a090] text-center px-2">Default</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-[12px] text-[#5c4f42] w-full" />
                <p className="text-[10px] text-[#b0a090] mt-1.5">Leave blank to keep the built-in default photo.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#ede4d8]">
            <PrimaryButton type="submit" disabled={savingText}>
              {savingText ? "Saving…" : "Save Section"}
            </PrimaryButton>
          </div>
        </form>
      </div>

      {/* ── FAQ items ── */}
      <div className="bg-white rounded-xl border border-[#ede4d8] p-5" style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}>
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#9c8a78] mb-4">Questions</h2>

        <form onSubmit={addItem} className="space-y-3 mb-6 p-4 rounded-lg bg-[#fdfaf6] border border-[#ede4d8]">
          <Field label="New Question">
            <input className={inputCls} value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="e.g. Do you offer international shipping?" />
          </Field>
          <Field label="Answer">
            <textarea rows={2} className={inputCls} value={newA} onChange={(e) => setNewA(e.target.value)} placeholder="Write the answer shown when this question is expanded…" />
          </Field>
          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={adding}>{adding ? "Adding…" : "+ Add Question"}</PrimaryButton>
          </div>
        </form>

        {items.length === 0 ? (
          <EmptyState message="No questions yet — add one above. Until then the homepage shows its built-in default FAQs." />
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <FaqRow
                key={item._id}
                item={item}
                index={i}
                total={items.length}
                onSave={saveItem}
                onDelete={setDeleteTarget}
                onMove={move}
                reordering={reordering}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this question?"
        message="It will be removed from the homepage FAQ section."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
