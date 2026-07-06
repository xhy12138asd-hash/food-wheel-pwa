import type { Nutrition, Settings } from "../types";
import { clampPercent, roundNutrition } from "../utils/nutrition";

interface ProgressCardProps {
  totals: Nutrition;
  settings: Settings;
}

export default function ProgressCard({ totals, settings }: ProgressCardProps) {
  const remaining = settings.calorieGoal - totals.calories;
  const isOver = remaining < 0;

  return (
    <section className="rounded-lg bg-white p-4 shadow-soft">
      <div className="grid grid-cols-3 gap-2">
        <Metric label="目标热量" value={settings.calorieGoal} unit="kcal" />
        <Metric label="已摄入" value={totals.calories} unit="kcal" highlight />
        <Metric label="剩余" value={remaining} unit="kcal" danger={isOver} />
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${isOver ? "bg-coral" : "bg-leaf"}`}
          style={{ width: `${clampPercent(totals.calories, settings.calorieGoal)}%` }}
        />
      </div>
      {isOver && (
        <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-center text-sm font-bold text-rose-600">
          今日已超出目标
        </div>
      )}
    </section>
  );
}

function Metric({
  label,
  value,
  unit,
  highlight,
  danger,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <div className="text-[11px] font-semibold text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-black ${danger ? "text-rose-600" : highlight ? "text-leaf" : "text-ink"}`}>
        {roundNutrition(value)}
      </div>
      <div className="text-[10px] font-semibold text-slate-400">{unit}</div>
    </div>
  );
}
