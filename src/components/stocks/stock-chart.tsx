"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type {
  CurrencyCode,
  HistoricalPricePoint,
  HistoricalRange
} from "@/lib/stocks";
import { cn } from "@/lib/utils";

const RANGES: HistoricalRange[] = ["1D", "1W", "1M", "6M", "1Y"];

type StockChartProps = {
  currency: CurrencyCode;
  currentPrice: number;
  dailyChangePercent: number;
  historical: Record<HistoricalRange, HistoricalPricePoint[]>;
};

export function StockChart({
  currency,
  currentPrice,
  dailyChangePercent,
  historical
}: StockChartProps) {
  const [selectedRange, setSelectedRange] = useState<HistoricalRange>("1D");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const points = historical[selectedRange];
  const isPositive = dailyChangePercent >= 0;
  const chart = useMemo(() => buildChart(points), [points]);
  const activePoint =
    activeIndex === null ? points[points.length - 1] : points[activeIndex];
  const activeCoordinate =
    activeIndex === null
      ? chart.coordinates[chart.coordinates.length - 1]
      : chart.coordinates[activeIndex];

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const index = Math.round((pointerX / bounds.width) * (points.length - 1));
    const nextIndex = Math.min(Math.max(index, 0), points.length - 1);

    setActiveIndex(nextIndex);
  }

  return (
    <Card className="overflow-hidden border-zinc-800 bg-[#1f1f1f] text-zinc-100 shadow-sm">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {formatCurrency(currentPrice, currency)}
            </p>
            <div
              className={cn(
                "mb-1 flex items-center gap-1.5 text-base font-semibold",
                isPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {isPositive ? "+" : ""}
              {dailyChangePercent.toFixed(2)}%
            </div>
          </div>
          <div className="text-sm text-zinc-400 lg:text-right">
            <span className="font-medium text-zinc-200">
              H {formatCurrency(chart.max, currency)}
            </span>
            <span className="mx-2 text-zinc-600">/</span>
            <span className="font-medium text-zinc-200">
              L {formatCurrency(chart.min, currency)}
            </span>
          </div>
        </div>

        <div className="mt-5 border-y border-zinc-800 py-3">
          <div className="grid grid-cols-5 gap-1 sm:flex sm:items-center sm:justify-between">
            {RANGES.map((range) => (
              <button
                className={cn(
                  "h-9 rounded-full px-3 text-sm font-semibold text-zinc-300 transition-colors sm:min-w-16",
                  selectedRange === range
                    ? "bg-zinc-700 text-white"
                    : "hover:bg-zinc-800 hover:text-white"
                )}
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  setActiveIndex(null);
                }}
                type="button"
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
        <div
          className="group relative h-[280px] w-full touch-none overflow-hidden bg-[#1f1f1f] sm:h-[360px] lg:h-[420px]"
          onPointerLeave={() => setActiveIndex(null)}
          onPointerMove={handlePointerMove}
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex flex-col justify-between py-4 text-right text-[11px] font-semibold text-zinc-200 sm:text-sm">
            {chart.yTicks.map((tick) => (
              <p key={`${selectedRange}-${tick}-axis`}>
                {formatCurrency(tick, currency)}
              </p>
            ))}
          </div>
          <svg
            aria-label={`${selectedRange} historical stock price chart`}
            className="h-full w-full transition-opacity duration-300"
            preserveAspectRatio="none"
            role="img"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="stock-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? "rgb(74 222 128)" : "rgb(251 113 133)"}
                  stopOpacity="0.34"
                />
                <stop
                  offset="54%"
                  stopColor={isPositive ? "rgb(74 222 128)" : "rgb(251 113 133)"}
                  stopOpacity="0.14"
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? "rgb(74 222 128)" : "rgb(251 113 133)"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            {chart.gridLines.map((line) => (
              <line
                key={`${selectedRange}-${line}-grid`}
                stroke="rgb(63 63 70)"
                strokeOpacity="0.7"
                strokeWidth="0.18"
                x1="0.2"
                x2="91"
                y1={line}
                y2={line}
              />
            ))}
            {chart.verticalGridLines.map((line) => (
              <line
                key={`${selectedRange}-${line}-vertical-grid`}
                stroke="rgb(63 63 70)"
                strokeOpacity="0.7"
                strokeWidth="0.18"
                x1={line}
                x2={line}
                y1="0"
                y2="92"
              />
            ))}
            <path
              className="transition-all duration-300 ease-out"
              d={chart.areaPath}
              fill="url(#stock-chart-fill)"
            />
            <path
              className="transition-all duration-300 ease-out"
              d={chart.linePath}
              fill="none"
              stroke={isPositive ? "rgb(74 222 128)" : "rgb(251 113 133)"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.35"
              vectorEffect="non-scaling-stroke"
            />
            {activeCoordinate ? (
              <>
                <line
                  className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  stroke="rgb(212 212 216)"
                  strokeOpacity="0.55"
                  strokeDasharray="3 4"
                  strokeWidth="0.35"
                  x1={activeCoordinate.x}
                  x2={activeCoordinate.x}
                  y1="0"
                  y2="92"
                />
                <circle
                  className="fill-[#1f1f1f] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  cx={activeCoordinate.x}
                  cy={activeCoordinate.y}
                  r="1.8"
                  stroke={isPositive ? "rgb(74 222 128)" : "rgb(251 113 133)"}
                  strokeWidth="0.8"
                />
              </>
            ) : null}
          </svg>

          {activePoint && activeCoordinate ? (
            <div
              className={cn(
                "pointer-events-none absolute top-4 z-20 rounded-lg border border-zinc-700 bg-zinc-950/95 px-3 py-2 text-sm shadow-lg backdrop-blur transition-opacity duration-150",
                activeCoordinate.x > 74 ? "-translate-x-full" : ""
              )}
              style={{
                left: `${Math.min(Math.max(activeCoordinate.x, 8), 92)}%`
              }}
            >
              <p className="font-medium text-zinc-100">{activePoint.label}</p>
              <p className="mt-1 text-zinc-400">
                {formatCurrency(activePoint.value, currency)}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex pr-[9%] text-xs font-semibold text-zinc-300 sm:text-sm">
          {getXAxisLabels(selectedRange, points).map((label) => (
            <span className="flex-1" key={`${selectedRange}-${label}-x-label`}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function buildChart(points: HistoricalPricePoint[]) {
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coordinates = points.map((point, index) => ({
    x: (index / Math.max(points.length - 1, 1)) * 91,
    y: 90 - ((point.value - min) / range) * 84
  }));
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L 91 92 L 0 92 Z`;

  return {
    areaPath,
    coordinates,
    gridLines: [7, 29, 51, 73, 92],
    linePath,
    max,
    mid: (max + min) / 2,
    min,
    verticalGridLines: [14, 28, 42, 56, 70, 84],
    yTicks: [
      max,
      max - range * 0.25,
      max - range * 0.5,
      max - range * 0.75,
      min
    ]
  };
}

function getXAxisLabels(
  range: HistoricalRange,
  points: HistoricalPricePoint[]
): string[] {
  if (range === "1D") {
    return ["8", "9", "10", "11", "12", "1"];
  }

  return [
    points[0]?.label ?? "",
    points[Math.floor(points.length / 2)]?.label ?? "",
    points[points.length - 1]?.label ?? ""
  ];
}

export function StockChartSkeleton() {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-[#1f1f1f]">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="h-10 w-48 animate-pulse rounded bg-zinc-800" />
          <div className="h-5 w-36 animate-pulse rounded bg-zinc-800" />
        </div>
        <div className="mt-5 border-y border-zinc-800 py-3">
          <div className="grid grid-cols-5 gap-1 sm:flex sm:justify-between">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                className="h-9 rounded-full bg-zinc-800 sm:w-16"
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
        <div className="h-[280px] animate-pulse bg-zinc-800 sm:h-[360px] lg:h-[420px]" />
      </div>
    </Card>
  );
}
