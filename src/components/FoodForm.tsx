import { useEffect, useState, type FormEvent } from "react";
import type { Food } from "../types";
import { createId } from "../utils/storage";

interface FoodFormProps {
  editingFood?: Food | null;
  onSubmit: (food: Food) => void;
  onCancel: () => void;
}

type FoodDraft = Omit<Food, "id">;

const emptyDraft: FoodDraft = {
  name: "",
  category: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  note: "",
};

export default function FoodForm({ editingFood, onSubmit, onCancel }: FoodFormProps) {
  const [draft, setDraft] = useState<FoodDraft>(emptyDraft);

  useEffect(() => {
    if (!editingFood) {
      setDraft(emptyDraft);
      return;
    }

    const { id: _id, ...foodDraft } = editingFood;
    setDraft(foodDraft);
  }, [editingFood]);

  function update<K extends keyof FoodDraft>(key: K, value: FoodDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;

    onSubmit({
      ...draft,
      id: editingFood?.id || createId("food"),
      name,
      category: draft.category.trim() || "未分类",
      note: draft.note.trim(),
    });
    setDraft(emptyDraft);
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black text-ink">{editingFood ? "编辑食物" : "添加食物"}</h2>
        {editingFood && (
          <button type="button" onClick={onCancel} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
            取消
          </button>
        )}
      </div>

      <div className="grid gap-3">
        <TextInput label="名称" value={draft.name} onChange={(value) => update("name", value)} required />
        <TextInput label="分类" value={draft.category} onChange={(value) => update("category", value)} placeholder="主食 / 轻食 / 面食" />
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
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-base outline-none focus:border-leaf focus:bg-white"
          />
        </label>
      </div>

      <button type="submit" className="mt-4 min-h-12 w-full rounded-lg bg-leaf px-4 text-base font-bold text-white shadow-soft">
        {editingFood ? "保存修改" : "添加食物"}
      </button>
    </form>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
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
