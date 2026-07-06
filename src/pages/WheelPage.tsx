import { useMemo, useState } from "react";
import NutritionCard from "../components/NutritionCard";
import ProgressCard from "../components/ProgressCard";
import SpinWheel from "../components/SpinWheel";
import type { Food, IntakeRecord, Settings } from "../types";
import { createId } from "../utils/storage";
import { sumFoods } from "../utils/nutrition";

interface WheelPageProps {
  foods: Food[];
  records: IntakeRecord[];
  settings: Settings;
  dateKey: string;
  isNetworkTimeSynced: boolean;
  onAddRecord: (record: IntakeRecord) => void;
}

export default function WheelPage({ foods, records, settings, dateKey, isNetworkTimeSynced, onAddRecord }: WheelPageProps) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const todayRecords = useMemo(() => records.filter((record) => record.date === dateKey), [dateKey, records]);
  const totals = useMemo(() => sumFoods(todayRecords), [todayRecords]);

  function addSelectedFood() {
    if (!selectedFood) return;
    onAddRecord({
      id: createId("record"),
      foodId: selectedFood.id,
      date: dateKey,
      createdAt: new Date().toISOString(),
      food: selectedFood,
    });
    setSelectedFood(null);
  }

  return (
    <main className="space-y-4">
      <header>
        <p className="text-sm font-bold text-leaf">今天吃什么转盘</p>
        <h1 className="mt-1 text-2xl font-black text-ink">让今天这餐轻松一点</h1>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          今日日期 {dateKey} · {isNetworkTimeSynced ? "网络时间已同步" : "正在使用本机时间"}
        </p>
      </header>

      <ProgressCard totals={totals} settings={settings} />
      <SpinWheel foods={foods} onResult={setSelectedFood} />

      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 px-4 pb-4 backdrop-blur-sm">
          <section className="mx-auto w-full max-w-md rounded-lg bg-white p-4 shadow-soft">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-leaf">抽中了</p>
                <h2 className="mt-1 text-2xl font-black text-ink">{selectedFood.name}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selectedFood.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600"
              >
                关闭
              </button>
            </div>
            <NutritionCard nutrition={selectedFood} />
            {selectedFood.note && <p className="mt-3 rounded-lg bg-amberSoft px-3 py-2 text-sm font-medium text-amber-800">{selectedFood.note}</p>}
            <button
              type="button"
              onClick={addSelectedFood}
              className="mt-4 min-h-12 w-full rounded-lg bg-leaf px-4 text-base font-bold text-white shadow-soft"
            >
              加入今日摄入
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
