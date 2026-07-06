import type { Nutrition, Settings } from "../types";
import { clampPercent, roundNutrition } from "../utils/nutrition";

interface ProgressCardProps {
  totals: Nutrition;
  settings: Settings;
}

export default function ProgressCard({ totals, settings }: ProgressCardProps) {
  const remaining = settings.calorieGoal - totals.calories;
  const isOver = remaining < 0;
  const macroRows = [
    { label: "蛋白质", eaten: totals.protein, goal: settings.proteinGoal, unit: "g" },
    { label: "碳水", eaten: totals.carbs, goal: settings.carbsGoal, unit: "g" },
    { label: "脂肪", eaten: totals.fat, goal: settings.fatGoal, unit: "g" },
    { label: "纤维", eaten: totals.fiber, goal: settings.fiberGoal, unit: "g" },
  ];

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
      <div className="mt-4 grid grid-cols-2 gap-2">
        {macroRows.map((row) => {
          const left = row.goal - row.eaten;
          return (
            <div key={row.label} className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-600">{row.label}</span>
                <span className={`text-xs font-black ${left < 0 ? "text-rose-600" : "text-leaf"}`}>
                  剩余 {roundNutrition(left)}
                  {row.unit}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full ${left < 0 ? "bg-coral" : "bg-leaf"}`}
                  style={{ width: `${clampPercent(row.eaten, row.goal)}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] font-semibold text-slate-400">
                {roundNutrition(row.eaten)} / {roundNutrition(row.goal)}
                {row.unit}
              </div>
            </div>
          );
        })}
      </div>
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
