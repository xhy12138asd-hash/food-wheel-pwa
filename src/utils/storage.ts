import type { AppData, Food, IntakeRecord, Settings } from "../types";

const STORAGE_KEY = "eat-wheel-app-data-v1";

export const defaultFoods: Food[] = [
  {
    id: "food-chicken-rice",
    name: "鸡胸肉饭",
    category: "主食",
    calories: 550,
    protein: 35,
    carbs: 65,
    fat: 12,
    fiber: 5,
    note: "高蛋白便当",
  },
  {
    id: "food-beef-noodle",
    name: "牛肉面",
    category: "面食",
    calories: 720,
    protein: 32,
    carbs: 90,
    fat: 22,
    fiber: 4,
    note: "适合运动后",
  },
  {
    id: "food-egg-sandwich",
    name: "鸡蛋三明治",
    category: "轻食",
    calories: 430,
    protein: 22,
    carbs: 45,
    fat: 16,
    fiber: 3,
    note: "早餐友好",
  },
  {
    id: "food-salad-chicken",
    name: "沙拉鸡胸肉",
    category: "轻食",
    calories: 380,
    protein: 38,
    carbs: 25,
    fat: 10,
    fiber: 8,
    note: "纤维更高",
  },
];

export const defaultSettings: Settings = {
  calorieGoal: 2000,
  proteinGoal: 120,
  carbsGoal: 200,
  fatGoal: 60,
  fiberGoal: 25,
};

export const defaultData: AppData = {
  foods: defaultFoods,
  records: [],
  settings: defaultSettings,
};

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveData(defaultData);
    return defaultData;
  }

  try {
    return normalizeData(JSON.parse(raw));
  } catch {
    saveData(defaultData);
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function normalizeData(value: unknown): AppData {
  const data = value as Partial<AppData>;
  return {
    foods: Array.isArray(data.foods) ? data.foods.map(normalizeFood) : defaultFoods,
    records: Array.isArray(data.records) ? data.records.map(normalizeRecord).filter(Boolean) as IntakeRecord[] : [],
    settings: {
      ...defaultSettings,
      ...(typeof data.settings === "object" && data.settings ? data.settings : {}),
    },
  };
}

function normalizeFood(food: Partial<Food>): Food {
  return {
    id: String(food.id || createId("food")),
    name: String(food.name || "未命名食物"),
    category: String(food.category || "未分类"),
    calories: Number(food.calories) || 0,
    protein: Number(food.protein) || 0,
    carbs: Number(food.carbs) || 0,
    fat: Number(food.fat) || 0,
    fiber: Number(food.fiber) || 0,
    note: String(food.note || ""),
  };
}

function normalizeRecord(record: Partial<IntakeRecord>): IntakeRecord | null {
  if (!record.food) return null;

  return {
    id: String(record.id || createId("record")),
    foodId: String(record.foodId || record.food.id || ""),
    date: String(record.date || ""),
    createdAt: String(record.createdAt || new Date().toISOString()),
    food: normalizeFood(record.food),
  };
}
