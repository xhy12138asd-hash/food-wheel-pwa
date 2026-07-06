import { Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import NutritionCard from "../components/NutritionCard";
import type { Food, IntakeRecord } from "../types";
import { formatTime } from "../utils/date";
import { sumFoods } from "../utils/nutrition";
import { createId } from "../utils/storage";

interface StatsPageProps {
  records: IntakeRecord[];
  dateKey: string;
  isNetworkTimeSynced: boolean;
  onAddRecord: (record: IntakeRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearToday: () => void;
}

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

export default function StatsPage({ records, dateKey, isNetworkTimeSynced, onAddRecord, onDeleteRecord, onClearToday }: StatsPageProps) {
  const [draft, setDraft] = useState<QuickFoodDraft>(emptyDraft);
  const todayRecords = records.filter((record) => record.date === dateKey);
  const totals = sumFoods(todayRecords);

  function update<K extends keyof QuickFoodDraft>(key: K, value: QuickFoodDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submitQuickRecord(event: FormEvent) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) return;

    const food: Food = {
      ...draft,
      id: createId("quick-food"),
      name,
      category: draft.category.trim() || "直接记录",
      note: draft.note.trim(),
    };

    onAddRecord({
      id: createId("record"),
      foodId: food.id,
      date: dateKey,
      createdAt: new Date().toISOString(),
      food,
    });
    setDraft(emptyDraft);
  }

  return (
    <main className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-leaf">今日统计</p>
          <h1 className="mt-1 text-2xl font-black text-ink">{dateKey}</h1>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {isNetworkTimeSynced ? "网络时间已同步" : "正在使用本机时间"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClearToday}
          disabled={!todayRecords.length}
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 disabled:bg-slate-100 disabled:text-slate-400"
        >
          清空
        </button>
      </header>

      <section className="rounded-lg bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-black text-ink">今日总计</h2>
        <NutritionCard nutrition={totals} />
      </section>

      <section className="rounded-lg bg-white p-4 shadow-soft">
        <h2 className="mb-4 text-lg font-black text-ink">直接添加今日摄入</h2>
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
            加入今日摄入
          </button>
        </form>
      </section>

      <section className="space-y-3">
        {todayRecords.length === 0 && (
          <div className="rounded-lg bg-white p-5 text-center font-semibold text-slate-500 shadow-soft">今天还没有记录</div>
        )}

        {todayRecords.map((record) => (
          <article key={record.id} className="flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-soft">
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-ink">{record.food.name}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {formatTime(record.createdAt)} · {record.food.calories} kcal · 蛋白质 {record.food.protein}g
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDeleteRecord(record.id)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600"
              aria-label="删除记录"
            >
              <Trash2 size={18} />
            </button>
          </article>
        ))}
      </section>
    </main>
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
