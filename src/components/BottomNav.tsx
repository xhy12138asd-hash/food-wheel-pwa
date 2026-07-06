import { BarChart3, Camera, Cog, Soup, Utensils } from "lucide-react";
import type { PageKey } from "../types";

interface BottomNavProps {
  active: PageKey;
  onChange: (page: PageKey) => void;
}

const items: Array<{ key: PageKey; label: string; Icon: typeof Soup }> = [
  { key: "wheel", label: "转盘", Icon: Soup },
  { key: "foods", label: "食物", Icon: Utensils },
  { key: "stats", label: "统计", Icon: BarChart3 },
  { key: "scan", label: "识别", Icon: Camera },
  { key: "settings", label: "设置", Icon: Cog },
];

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pt-2 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur safe-bottom">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold transition ${
                isActive ? "bg-mint text-leaf" : "text-slate-500 active:bg-slate-100"
              }`}
              aria-label={label}
            >
              <Icon size={21} strokeWidth={isActive ? 2.7 : 2.2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
