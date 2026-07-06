import { useMemo, useState } from "react";
import type { Food } from "../types";

interface SpinWheelProps {
  foods: Food[];
  onResult: (food: Food) => void;
}

const colors = ["#86efac", "#fda4af", "#fde68a", "#93c5fd", "#c4b5fd", "#67e8f9", "#f9a8d4", "#bef264"];

export default function SpinWheel({ foods, onResult }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const gradient = useMemo(() => {
    if (!foods.length) return "#e2e8f0";
    const step = 360 / foods.length;
    return `conic-gradient(from -90deg, ${foods
      .map((_, index) => `${colors[index % colors.length]} ${index * step}deg ${(index + 1) * step}deg`)
      .join(", ")})`;
  }, [foods]);

  function spin() {
    if (!foods.length || isSpinning) return;

    const selectedIndex = Math.floor(Math.random() * foods.length);
    const step = 360 / foods.length;
    const selectedCenter = selectedIndex * step + step / 2;
    const target = rotation + 1080 + (360 - selectedCenter);

    setIsSpinning(true);
    setRotation(target);
    window.setTimeout(() => {
      setIsSpinning(false);
      onResult(foods[selectedIndex]);
    }, 3100);
  }

  return (
    <section className="rounded-lg bg-white p-4 shadow-soft">
      <div className="relative mx-auto aspect-square w-full max-w-[19rem]">
        <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 -translate-y-1 border-x-[13px] border-t-[24px] border-x-transparent border-t-ink drop-shadow" />
        <div
          className="relative h-full w-full rounded-full border-[10px] border-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.12),0_16px_40px_rgba(15,23,42,0.12)] transition-transform duration-[3000ms] ease-out"
          style={{ background: gradient, transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute inset-[42%] rounded-full border-4 border-white bg-ink shadow-lg" />
          {foods.map((food, index) => {
            const angle = (360 / foods.length) * index + 360 / foods.length / 2;
            return (
              <div
                key={food.id}
                className="absolute left-1/2 top-1/2 origin-left text-[11px] font-black text-ink"
                style={{ transform: `rotate(${angle}deg) translateX(4.2rem) rotate(90deg)`, width: "4.6rem" }}
              >
                <span className="block truncate rounded bg-white/55 px-1 py-0.5 text-center backdrop-blur-sm">
                  {food.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={!foods.length || isSpinning}
        className="mt-5 min-h-12 w-full rounded-lg bg-ink px-4 text-base font-bold text-white shadow-soft transition active:scale-[0.99] disabled:bg-slate-300"
      >
        {isSpinning ? "转动中..." : "开始转动"}
      </button>
      {!foods.length && <p className="mt-3 text-center text-sm font-medium text-slate-500">请先去食物管理添加食物</p>}
    </section>
  );
}
