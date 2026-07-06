export type PageKey = "wheel" | "foods" | "stats" | "settings";

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Food extends Nutrition {
  id: string;
  name: string;
  category: string;
  note: string;
}

export interface IntakeRecord {
  id: string;
  foodId: string;
  date: string;
  createdAt: string;
  food: Food;
}

export interface Settings {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  fiberGoal: number;
}

export interface AppData {
  foods: Food[];
  records: IntakeRecord[];
  settings: Settings;
}
