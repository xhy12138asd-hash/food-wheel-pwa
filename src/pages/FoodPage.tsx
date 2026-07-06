import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import FoodForm from "../components/FoodForm";
import NutritionCard from "../components/NutritionCard";
import type { Food } from "../types";

interface FoodPageProps {
  foods: Food[];
  onSaveFood: (food: Food) => void;
  onDeleteFood: (id: string) => void;
}

export default function FoodPage({ foods, onSaveFood, onDeleteFood }: FoodPageProps) {
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  function saveFood(food: Food) {
    onSaveFood(food);
    setEditingFood(null);
  }

  return (
    <main className="space-y-4">
      <header>
        <p className="text-sm font-bold text-leaf">食物管理</p>
        <h1 className="mt-1 text-2xl font-black text-ink">维护你的转盘选项</h1>
      </header>

      <FoodForm editingFood={editingFood} onSubmit={saveFood} onCancel={() => setEditingFood(null)} />

      <section className="space-y-3">
        {foods.map((food) => (
          <article key={food.id} className="rounded-lg bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-black text-ink">{food.name}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{food.category}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFood(food)}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700"
                  aria-label="编辑食物"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteFood(food.id)}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-600"
                  aria-label="删除食物"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <NutritionCard nutrition={food} compact />
            {food.note && <p className="mt-3 text-sm font-medium text-slate-500">{food.note}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}
