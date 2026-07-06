import { Trash2 } from "lucide-react";
import NutritionCard from "../components/NutritionCard";
import type { IntakeRecord } from "../types";
import { formatTime } from "../utils/date";
import { sumFoods } from "../utils/nutrition";

interface StatsPageProps {
  records: IntakeRecord[];
  dateKey: string;
  isNetworkTimeSynced: boolean;
  onDeleteRecord: (id: string) => void;
  onClearToday: () => void;
}

export default function StatsPage({ records, dateKey, isNetworkTimeSynced, onDeleteRecord, onClearToday }: StatsPageProps) {
  const todayRecords = records.filter((record) => record.date === dateKey);
  const totals = sumFoods(todayRecords);

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
