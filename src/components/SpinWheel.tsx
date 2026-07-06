import { useMemo, useState } from "react";
import type { Food } from "../types";

interface SpinWheelProps {
  foods: Food[];
  onResult: (food: Food) => void;
}

const colors = ["#86efac", "#fda4af", "#fde68a", "#93c5fd", "#c4b5fd", "#67e8f9", "#f9a8d4", "#bef264"];
const CENTER = 100;
const RADIUS = 96;
const LABEL_RADIUS = 58;

export default function SpinWheel({ foods, onResult }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const slices = useMemo(() => {
    if (!foods.length) return [];
    const step = 360 / foods.length;

    return foods.map((food, index) => {
      const start = index * step;
      const end = (index + 1) * step;
      const mid = start + step / 2;
      const label = getLabelLines(food.name, foods.length);
      const labelRadius = foods.length <= 4 ? LABEL_RADIUS : LABEL_RADIUS + 8;
      const labelPoint = polarToCartesian(CENTER, CENTER, labelRadius, mid);
      const labelWidth = Math.max(...label.map((line) => line.length)) * 8 + 8;
      const labelHeight = label.length > 1 ? 22 : 13;

      return {
        food,
        color: colors[index % colors.length],
        path: describeSlice(CENTER, CENTER, RADIUS, start, end),
        mid,
        label,
        labelPoint,
        labelWidth,
        labelHeight,
      };
    });
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
          className="relative h-full w-full rounded-full border-[10px] border-white bg-slate-200 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.12),0_16px_40px_rgba(15,23,42,0.12)] transition-transform duration-[3000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg className="h-full w-full overflow-visible rounded-full" viewBox="0 0 200 200" aria-hidden="true">
            {slices.map((slice) => (
              <g key={slice.food.id}>
                <path d={slice.path} fill={slice.color} stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" />
                <rect
                  x={slice.labelPoint.x - slice.labelWidth / 2}
                  y={slice.labelPoint.y - slice.labelHeight / 2}
                  width={slice.labelWidth}
                  height={slice.labelHeight}
                  rx="4"
                  fill="rgba(255,255,255,0.66)"
                />
                <text
                  x={slice.labelPoint.x}
                  y={slice.labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none fill-ink text-[8.5px] font-black"
                >
                  {slice.label.map((line, lineIndex) => (
                    <tspan key={line} x={slice.labelPoint.x} dy={lineIndex === 0 ? (slice.label.length > 1 ? "-0.55em" : "0") : "1.1em"}>
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}
            <circle cx="100" cy="100" r="21" fill="#1f2937" stroke="white" strokeWidth="5" />
          </svg>
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

function polarToCartesian(centerX: number, centerY: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  };
}

function describeSlice(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function getLabelLines(name: string, itemCount: number) {
  const compactName = name.trim() || "未命名";
  const maxChars = itemCount <= 4 ? 8 : itemCount <= 7 ? 6 : 4;
  const clipped = compactName.length > maxChars * 2 ? `${compactName.slice(0, maxChars * 2 - 1)}…` : compactName;

  if (clipped.length <= maxChars) return [clipped];
  return [clipped.slice(0, maxChars), clipped.slice(maxChars)];
}
