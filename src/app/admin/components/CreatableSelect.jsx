"use client";
import { useState } from "react";
import { selectCls, inputCls } from "./ui";

const ADD_NEW = "__add_new__";

/**
 * A <select> that also lets the admin add a brand-new option on the spot,
 * instead of being limited to a fixed dropdown list.
 *
 * options: [{ value, label }]
 * onAddOption(typedText): async fn that creates the option (server-side) and
 *   resolves to the new { value, label } to select. Throw to show an error.
 */
export default function CreatableSelect({
  value,
  onChange,
  options,
  onAddOption,
  placeholder = "Type new value",
  emptyLabel = "— None —",
  allowEmpty = true,
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const startAdding = () => {
    setErr("");
    setDraft("");
    setAdding(true);
  };

  const cancelAdding = () => {
    setAdding(false);
    setDraft("");
    setErr("");
  };

  const confirmAdd = async () => {
    const text = draft.trim();
    if (!text) return;
    setSaving(true);
    setErr("");
    try {
      const created = await onAddOption(text);
      onChange(created?.value ?? text);
      setAdding(false);
      setDraft("");
    } catch (e) {
      setErr(e.message || "Couldn't add that option");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {!adding ? (
        <select
          className={selectCls}
          value={value}
          onChange={(e) => (e.target.value === ADD_NEW ? startAdding() : onChange(e.target.value))}
        >
          {allowEmpty && <option value="">{emptyLabel}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
          <option value={ADD_NEW}>+ Add new…</option>
        </select>
      ) : (
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <input
              autoFocus
              className={inputCls}
              placeholder={placeholder}
              value={draft}
              disabled={saving}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); confirmAdd(); }
                if (e.key === "Escape") { e.preventDefault(); cancelAdding(); }
              }}
            />
            {err && <p className="text-[11px] text-red-600 mt-1">{err}</p>}
          </div>
          <button
            type="button"
            onClick={confirmAdd}
            disabled={saving || !draft.trim()}
            className="shrink-0 text-[11px] px-3 py-2 rounded-lg bg-[#1a1008] text-[#e8d5b0] disabled:opacity-50"
          >
            {saving ? "Adding…" : "Add"}
          </button>
          <button
            type="button"
            onClick={cancelAdding}
            disabled={saving}
            className="shrink-0 text-[11px] px-3 py-2 rounded-lg border border-[#e0d4c4] text-[#5c4f42] hover:bg-[#fdfaf6]"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
