import type { Food, IntakeRecord, Nutrition } from "../types";

export const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
};

export function sumFoods(items: Array<Food | IntakeRecord>): Nutrition {
  return items.reduce<Nutrition>((total, item) => {
    const food = "food" in item ? item.food : item;
    return {
      calories: total.calories + food.calories,
      protein: total.protein + food.protein,
      carbs: total.carbs + food.carbs,
      fat: total.fat + food.fat,
      fiber: total.fiber + food.fiber,
    };
  }, emptyNutrition);
}

export function clampPercent(value: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / target) * 100)));
}

export function roundNutrition(value: number): number {
  return Math.round(value * 10) / 10;
}
