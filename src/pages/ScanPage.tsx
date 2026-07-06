import { Camera, Sparkles } from "lucide-react";
import { useState } from "react";
import NutritionCard from "../components/NutritionCard";
import type { Food, IntakeRecord } from "../types";
import { createId } from "../utils/storage";
import { fileToDataUrl, getZhipuApiKey, recognizeFoodFromImage } from "../utils/zhipu";

interface ScanPageProps {
  dateKey: string;
  onAddRecord: (record: IntakeRecord) => void;
}

export default function ScanPage({ dateKey, onAddRecord }: ScanPageProps) {
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [resultFood, setResultFood] = useState<Food | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function chooseImage(file: File | undefined) {
    if (!file) return;
    setMessage("");
    setResultFood(null);
    setImageDataUrl(await fileToDataUrl(file));
  }

  async function recognize() {
    if (!imageDataUrl) {
      setMessage("请先选择或拍摄食物图片");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const food = await recognizeFoodFromImage(getZhipuApiKey(), imageDataUrl);
      setResultFood({
        ...food,
        id: createId("ai-food"),
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "识别失败";
      setMessage(`识别失败：${detail}`);
    } finally {
      setIsLoading(false);
    }
  }

  function addResultFood() {
    if (!resultFood) return;
    onAddRecord({
      id: createId("record"),
      foodId: resultFood.id,
      date: dateKey,
      createdAt: new Date().toISOString(),
      food: resultFood,
    });
    setMessage("已加入今日摄入");
    setResultFood(null);
    setImageDataUrl("");
  }

  return (
    <main className="space-y-4">
      <header>
        <p className="text-sm font-bold text-leaf">图片识别</p>
        <h1 className="mt-1 text-2xl font-black text-ink">拍一下，估算营养</h1>
        <p className="mt-1 text-xs font-semibold text-slate-400">已内置识别接口，结果加入前可以先核对</p>
      </header>

      <section className="rounded-lg bg-white p-4 shadow-soft">
        <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 text-center active:bg-mint">
          {imageDataUrl ? (
            <img src={imageDataUrl} alt="待识别食物" className="max-h-56 w-full rounded-lg object-cover" />
          ) : (
            <>
              <Camera size={34} className="text-leaf" />
              <span className="mt-3 text-base font-black text-ink">选择或拍摄食物图片</span>
              <span className="mt-1 text-sm font-semibold text-slate-500">支持相册或相机</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => chooseImage(event.target.files?.[0])}
          />
        </label>

        <button
          type="button"
          onClick={recognize}
          disabled={isLoading || !imageDataUrl}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 text-base font-bold text-white shadow-soft disabled:bg-slate-300"
        >
          <Sparkles size={19} />
          {isLoading ? "识别中..." : "开始识别"}
        </button>
        {message && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm font-bold text-slate-600">{message}</p>}
      </section>

      {resultFood && (
        <section className="rounded-lg bg-white p-4 shadow-soft">
          <div className="mb-4">
            <p className="text-sm font-bold text-leaf">识别结果</p>
            <h2 className="mt-1 text-2xl font-black text-ink">{resultFood.name}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{resultFood.category}</p>
          </div>
          <NutritionCard nutrition={resultFood} />
          {resultFood.note && <p className="mt-3 rounded-lg bg-amberSoft px-3 py-2 text-sm font-medium text-amber-800">{resultFood.note}</p>}
          <button
            type="button"
            onClick={addResultFood}
            className="mt-4 min-h-12 w-full rounded-lg bg-leaf px-4 text-base font-bold text-white shadow-soft"
          >
            加入今日摄入
          </button>
        </section>
      )}
    </main>
  );
}
