import { useEffect, useState, type FormEvent } from "react";
import type { Food } from "../types";
import { createId } from "../utils/storage";

type QuickFoodDraft = Omit<Food, "id">;

const emptyDraft: QuickFoodDraft = {
  name: "",
  category: "直接记录",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  note: "",
};

interface QuickIntakeFormProps {
  onSubmit: (food: Food) => void;
  initialFood?: Food | null;
  submitLabel?: string;
  resetOnSubmit?: boolean;
}

export default function QuickIntakeForm({
  onSubmit,
  initialFood = null,
  submitLabel = "加入今日摄入",
  resetOnSubmit = true,
}: QuickIntakeFormProps) {
  const [draft, setDraft] = useState<QuickFoodDraft>(emptyDraft);

  useEffect(() => {
    if (!initialFood) {
      setDraft(emptyDraft);
      return;
    }

    const { id: _id, ...foodDraft } = initialFood;
    setDraft(foodDraft);
  }, [initialFood]);

  function update<K extends keyof QuickFoodDraft>(key: K, value: QuickFoodDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submitQuickRecord(event: FormEvent) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;

    onSubmit({
      ...draft,
      id: initialFood?.id || createId("quick-food"),
      name,
      category: draft.category.trim() || "直接记录",
      note: draft.note.trim(),
    });
    if (resetOnSubmit) setDraft(emptyDraft);
  }

  return (
    <form onSubmit={submitQuickRecord} className="grid gap-3">
      <TextInput label="食物名称" value={draft.name} onChange={(value) => update("name", value)} required />
      <TextInput label="分类" value={draft.category} onChange={(value) => update("category", value)} />
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="热量 kcal" value={draft.calories} onChange={(value) => update("calories", value)} />
        <NumberInput label="蛋白质 g" value={draft.protein} onChange={(value) => update("protein", value)} />
        <NumberInput label="碳水 g" value={draft.carbs} onChange={(value) => update("carbs", value)} />
        <NumberInput label="脂肪 g" value={draft.fat} onChange={(value) => update("fat", value)} />
        <NumberInput label="膳食纤维 g" value={draft.fiber} onChange={(value) => update("fiber", value)} />
      </div>
      <label className="grid gap-1.5">
        <span className="text-sm font-bold text-slate-700">备注</span>
        <textarea
          value={draft.note}
          onChange={(event) => update("note", event.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-base outline-none focus:border-leaf focus:bg-white"
        />
      </label>
      <button type="submit" className="min-h-12 rounded-lg bg-leaf px-4 text-base font-bold text-white shadow-soft">
        {submitLabel}
      </button>
    </form>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-leaf focus:bg-white"
      />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        type="number"
        min="0"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-leaf focus:bg-white"
      />
    </label>
  );
}
