import { useEffect, useMemo, useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import NutritionCard from "../components/NutritionCard";
import QuickIntakeForm from "../components/QuickIntakeForm";
import type { Food, IntakeRecord } from "../types";
import { formatTime } from "../utils/date";
import { sumFoods } from "../utils/nutrition";
import { createId } from "../utils/storage";

interface StatsPageProps {
  records: IntakeRecord[];
  dateKey: string;
  isNetworkTimeSynced: boolean;
  onAddRecord: (record: IntakeRecord) => void;
  onUpdateRecord: (record: IntakeRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearToday: () => void;
}

export default function StatsPage({
  records,
  dateKey,
  isNetworkTimeSynced,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onClearToday,
}: StatsPageProps) {
  const [selectedDate, setSelectedDate] = useState(dateKey);
  const [editingRecord, setEditingRecord] = useState<IntakeRecord | null>(null);
  const recordDates = useMemo(() => {
    return Array.from(new Set([dateKey, ...records.map((record) => record.date).filter(Boolean)])).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [dateKey, records]);

  useEffect(() => {
    setSelectedDate((current) => current || dateKey);
  }, [dateKey]);

  const todayRecords = records.filter((record) => record.date === dateKey);
  const selectedRecords = records.filter((record) => record.date === selectedDate);
  const totals = sumFoods(selectedRecords);
  const isViewingToday = selectedDate === dateKey;

  function addQuickFood(food: Food) {
    onAddRecord({
      id: createId("record"),
      foodId: food.id,
      date: dateKey,
      createdAt: new Date().toISOString(),
      food,
    });
  }

  function saveEditingFood(food: Food) {
    if (!editingRecord) return;
    onUpdateRecord({
      ...editingRecord,
      foodId: food.id,
      food,
    });
    setEditingRecord(null);
  }

  return (
    <main className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-leaf">{isViewingToday ? "今日统计" : "历史记录"}</p>
          <h1 className="mt-1 text-2xl font-black text-ink">{selectedDate}</h1>
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
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-ink">选择日期</h2>
          {!isViewingToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(dateKey)}
              className="rounded-lg bg-mint px-3 py-2 text-sm font-bold text-leaf"
            >
              回到今天
            </button>
          )}
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value || dateKey)}
          className="min-h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base font-bold text-ink outline-none focus:border-leaf focus:bg-white"
        />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scroll-clean">
          {recordDates.map((recordDate) => (
            <button
              key={recordDate}
              type="button"
              onClick={() => setSelectedDate(recordDate)}
              className={`min-h-10 shrink-0 rounded-lg px-3 text-sm font-bold ${
                selectedDate === recordDate ? "bg-ink text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {recordDate === dateKey ? "今天" : recordDate.slice(5)}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-black text-ink">{isViewingToday ? "今日总计" : "当日总计"}</h2>
        <NutritionCard nutrition={totals} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-ink">摄入记录</h2>
        {selectedRecords.length === 0 && (
          <div className="rounded-lg bg-white p-5 text-center font-semibold text-slate-500 shadow-soft">
            {isViewingToday ? "今天还没有记录" : "这一天没有记录"}
          </div>
        )}

        {selectedRecords.map((record) => (
          <article key={record.id} className="flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-soft">
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-ink">{record.food.name}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {formatTime(record.createdAt)} · {record.food.calories} kcal · 蛋白质 {record.food.protein}g
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setEditingRecord(record)}
                className="flex min-h-10 items-center gap-1 rounded-lg bg-slate-100 px-3 text-sm font-bold text-slate-700"
                aria-label="编辑记录"
              >
                <Edit3 size={18} />
                改
              </button>
              <button
                type="button"
                onClick={() => onDeleteRecord(record.id)}
                className="flex min-h-10 items-center gap-1 rounded-lg bg-rose-50 px-3 text-sm font-bold text-rose-600"
                aria-label="删除记录"
              >
                <Trash2 size={18} />
                删
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg bg-white p-4 shadow-soft">
        <h2 className="mb-4 text-lg font-black text-ink">直接添加今日摄入</h2>
        <QuickIntakeForm onSubmit={addQuickFood} />
      </section>

      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 px-4 pb-4 backdrop-blur-sm">
          <section className="mx-auto max-h-[88vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4 shadow-soft scroll-clean">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-leaf">编辑记录</p>
                <h2 className="mt-1 text-2xl font-black text-ink">{editingRecord.date}</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600"
              >
                关闭
              </button>
            </div>
            <QuickIntakeForm
              initialFood={editingRecord.food}
              onSubmit={saveEditingFood}
              submitLabel="保存记录"
              resetOnSubmit={false}
            />
          </section>
        </div>
      )}
    </main>
  );
}
