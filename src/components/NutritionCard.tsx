import type { Nutrition } from "../types";
import { roundNutrition } from "../utils/nutrition";

interface NutritionCardProps {
  nutrition: Nutrition;
  compact?: boolean;
}

const fields: Array<{ key: keyof Nutrition; label: string; unit: string }> = [
  { key: "calories", label: "热量", unit: "kcal" },
  { key: "protein", label: "蛋白质", unit: "g" },
  { key: "carbs", label: "碳水", unit: "g" },
  { key: "fat", label: "脂肪", unit: "g" },
  { key: "fiber", label: "膳食纤维", unit: "g" },
];

export default function NutritionCard({ nutrition, compact = false }: NutritionCardProps) {
  return (
    <div className={`grid ${compact ? "grid-cols-5 gap-2" : "grid-cols-2 gap-3"}`}>
      {fields.map((field) => (
        <div key={field.key} className="rounded-lg bg-slate-50 p-3">
          <div className="text-[11px] font-medium text-slate-500">{field.label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`${compact ? "text-base" : "text-xl"} font-bold text-ink`}>
              {roundNutrition(nutrition[field.key])}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">{field.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
