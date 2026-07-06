import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { AppData, Settings } from "../types";
import { normalizeData } from "../utils/storage";

interface SettingsPageProps {
  data: AppData;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onImportData: (data: AppData) => void;
}

export default function SettingsPage({ data, settings, onUpdateSettings, onImportData }: SettingsPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  function update<K extends keyof Settings>(key: K, value: number) {
    onUpdateSettings({ ...settings, [key]: value });
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `今天吃什么转盘-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("数据已导出");
  }

  async function importData(file: File | undefined) {
    if (!file) return;
    try {
      const text = await file.text();
      onImportData(normalizeData(JSON.parse(text)));
      setMessage("数据已导入");
    } catch {
      setMessage("导入失败，请检查 JSON 文件");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <main className="space-y-4">
      <header>
        <p className="text-sm font-bold text-leaf">设置</p>
        <h1 className="mt-1 text-2xl font-black text-ink">目标与备份</h1>
      </header>

      <section className="rounded-lg bg-white p-4 shadow-soft">
        <h2 className="mb-4 text-lg font-black text-ink">每日目标</h2>
        <div className="grid gap-3">
          <GoalInput label="热量目标 kcal" value={settings.calorieGoal} onChange={(value) => update("calorieGoal", value)} />
          <GoalInput label="蛋白质目标 g" value={settings.proteinGoal} onChange={(value) => update("proteinGoal", value)} />
          <GoalInput label="碳水目标 g" value={settings.carbsGoal} onChange={(value) => update("carbsGoal", value)} />
          <GoalInput label="膳食纤维目标 g" value={settings.fiberGoal} onChange={(value) => update("fiberGoal", value)} />
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow-soft">
        <h2 className="mb-4 text-lg font-black text-ink">数据备份</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={exportData}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-ink px-4 font-bold text-white"
          >
            <Download size={18} />
            导出 JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-leaf px-4 font-bold text-white"
          >
            <Upload size={18} />
            导入 JSON
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => importData(event.target.files?.[0])}
        />
        {message && <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm font-bold text-slate-600">{message}</p>}
      </section>
    </main>
  );
}

function GoalInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        type="number"
        min="0"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-leaf focus:bg-white"
      />
    </label>
  );
}
