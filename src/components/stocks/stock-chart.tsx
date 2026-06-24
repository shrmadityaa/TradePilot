"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
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
    const chartWidth = bounds.width * 0.91;
    const clampedX = Math.min(Math.max(pointerX, 0), chartWidth);
    const index = Math.round((clampedX / chartWidth) * (points.length - 1));
    const nextIndex = Math.min(Math.max(index, 0), points.length - 1);

    setActiveIndex(nextIndex);
  }

  const strokeColor = isPositive ? "rgb(52 211 153)" : "rgb(251 113 133)";
  const fillColorStart = isPositive ? "rgb(52 211 153)" : "rgb(251 113 133)";

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {formatCurrency(currentPrice, currency)}
            </p>
            <div
              className={cn(
                "mb-1 flex items-center gap-1.5 text-base font-semibold",
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
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
          <div className="text-sm text-muted-foreground lg:text-right">
            <span className="font-medium text-foreground">
              H {formatCurrency(chart.max, currency)}
            </span>
            <span className="mx-2 text-border">/</span>
            <span className="font-medium text-foreground">
              L {formatCurrency(chart.min, currency)}
            </span>
          </div>
        </div>

        <div className="mt-5 border-y py-3">
          <div className="grid grid-cols-5 gap-1 sm:flex sm:items-center sm:justify-between">
            {RANGES.map((range) => (
              <button
                className={cn(
                  "h-9 rounded-full px-3 text-sm font-semibold transition-colors sm:min-w-16",
                  selectedRange === range
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
          className="group relative h-[280px] w-full touch-none overflow-hidden sm:h-[360px] lg:h-[420px]"
          onPointerLeave={() => setActiveIndex(null)}
          onPointerMove={handlePointerMove}
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex flex-col justify-between py-4 text-right text-[11px] font-medium text-muted-foreground sm:text-xs">
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
                  stopColor={fillColorStart}
                  stopOpacity="0.25"
                />
                <stop
                  offset="60%"
                  stopColor={fillColorStart}
                  stopOpacity="0.08"
                />
                <stop
                  offset="100%"
                  stopColor={fillColorStart}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            {chart.gridLines.map((line) => (
              <line
                key={`${selectedRange}-${line}-grid`}
                className="stroke-border"
                strokeOpacity="0.5"
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
                className="stroke-border"
                strokeOpacity="0.5"
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
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            {activeIndex !== null && activeCoordinate ? (
              <line
                stroke={strokeColor}
                strokeOpacity="0.5"
                strokeWidth="0.3"
                x1={activeCoordinate.x}
                x2={activeCoordinate.x}
                y1="0"
                y2="92"
              />
            ) : null}
          </svg>

          {activeIndex !== null && activeCoordinate && activePoint ? (
            <>
              <div
                className="pointer-events-none absolute z-20"
                style={{
                  left: `${activeCoordinate.x}%`,
                  top: `${activeCoordinate.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: strokeColor, boxShadow: `0 0 6px ${strokeColor}` }}
                />
              </div>

              <div
                className="pointer-events-none absolute z-20"
                style={{
                  left: `${activeCoordinate.x}%`,
                  top: `${Math.max(activeCoordinate.y - 5, 1)}%`,
                  transform: `translateX(${activeCoordinate.x > 80 ? "-90%" : activeCoordinate.x < 10 ? "-10%" : "-50%"})`,
                }}
              >
                <p className="text-sm font-semibold" style={{ color: strokeColor }}>
                  {formatCurrency(activePoint.value, currency)}
                </p>
              </div>
            </>
          ) : null}
        </div>

        <div className="flex pr-[9%] text-xs font-medium text-muted-foreground sm:text-sm">
          {getXAxisLabels(selectedRange, points).map((label) => (
            <span className="flex-1" key={`${selectedRange}-${label}-x-label`}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
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
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="h-10 w-48 animate-pulse rounded bg-muted" />
          <div className="h-5 w-36 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-5 border-y py-3">
          <div className="grid grid-cols-5 gap-1 sm:flex sm:justify-between">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                className="h-9 rounded-full bg-muted sm:w-16"
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
        <div className="h-[280px] animate-pulse rounded bg-muted sm:h-[360px] lg:h-[420px]" />
      </div>
    </div>
  );
}
