"use client";

import { useMemo, useState } from "react";
import { AreaChart, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [selectedRange, setSelectedRange] = useState<HistoricalRange>("1M");
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
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AreaChart className="h-4 w-4 text-primary" />
              Historical Price
            </div>
            <CardTitle>Price performance</CardTitle>
          </div>
          <div className="grid grid-cols-5 rounded-lg border bg-background p-1">
            {RANGES.map((range) => (
              <button
                className={cn(
                  "h-8 rounded-md px-2.5 text-sm font-medium transition-all duration-200 sm:px-3",
                  selectedRange === range
                    ? "bg-primary text-primary-foreground shadow-sm"
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

        <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          <ChartStat label="Current Price" value={formatCurrency(currentPrice, currency)} />
          <ChartStat
            label="Daily Change"
            value={`${isPositive ? "+" : ""}${dailyChangePercent.toFixed(2)}%`}
            valueClassName={
              isPositive
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300"
            }
            icon={
              isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )
            }
          />
          <ChartStat label="High" value={formatCurrency(chart.max, currency)} />
          <ChartStat label="Low" value={formatCurrency(chart.min, currency)} />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div
          className="group relative h-[240px] w-full touch-none overflow-hidden rounded-lg bg-background sm:h-[320px] lg:h-[360px]"
          onPointerLeave={() => setActiveIndex(null)}
          onPointerMove={handlePointerMove}
        >
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
                  stopColor={isPositive ? "rgb(16 185 129)" : "rgb(244 63 94)"}
                  stopOpacity="0.34"
                />
                <stop
                  offset="58%"
                  stopColor={isPositive ? "rgb(16 185 129)" : "rgb(244 63 94)"}
                  stopOpacity="0.08"
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? "rgb(16 185 129)" : "rgb(244 63 94)"}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            {chart.gridLines.map((line) => (
              <line
                className="stroke-border/60"
                key={line}
                strokeDasharray="2 6"
                strokeWidth="0.25"
                x1="0"
                x2="100"
                y1={line}
                y2={line}
              />
            ))}
            <path
              className="transition-all duration-300 ease-out"
              d={chart.areaPath}
              fill="url(#stock-chart-fill)"
            />
            <path
              className="drop-shadow-sm transition-all duration-300 ease-out"
              d={chart.linePath}
              fill="none"
              stroke={isPositive ? "rgb(16 185 129)" : "rgb(244 63 94)"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.4"
              vectorEffect="non-scaling-stroke"
            />
            {activeCoordinate ? (
              <>
                <line
                  className="stroke-muted-foreground/35 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  strokeDasharray="3 4"
                  strokeWidth="0.35"
                  x1={activeCoordinate.x}
                  x2={activeCoordinate.x}
                  y1="8"
                  y2="92"
                />
                <circle
                  className="fill-background opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  cx={activeCoordinate.x}
                  cy={activeCoordinate.y}
                  r="1.8"
                  stroke={isPositive ? "rgb(16 185 129)" : "rgb(244 63 94)"}
                  strokeWidth="0.8"
                />
              </>
            ) : null}
          </svg>

          {activePoint && activeCoordinate ? (
            <div
              className={cn(
                "pointer-events-none absolute top-4 z-10 rounded-lg border bg-card/95 px-3 py-2 text-sm shadow-lg backdrop-blur transition-opacity duration-150",
                activeCoordinate.x > 74 ? "-translate-x-full" : ""
              )}
              style={{
                left: `${Math.min(Math.max(activeCoordinate.x, 8), 92)}%`
              }}
            >
              <p className="font-medium">{activePoint.label}</p>
              <p className="mt-1 text-muted-foreground">
                {formatCurrency(activePoint.value, currency)}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>{points[0]?.label}</span>
          <span>{points[Math.floor(points.length / 2)]?.label}</span>
          <span>{points[points.length - 1]?.label}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartStat({
  icon,
  label,
  value,
  valueClassName
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1.5 text-lg font-semibold tracking-tight",
          valueClassName
        )}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}

function buildChart(points: HistoricalPricePoint[]) {
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const coordinates = points.map((point, index) => ({
    x: (index / Math.max(points.length - 1, 1)) * 100,
    y: 90 - ((point.value - min) / range) * 80
  }));
  const linePath = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  return {
    areaPath,
    coordinates,
    gridLines: [12, 31, 50, 69, 88],
    linePath,
    max,
    min
  };
}

export function StockChartSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted sm:w-72" />
        </div>
        <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="rounded-lg border bg-card px-4 py-3" key={index}>
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-6 w-28 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="h-[240px] animate-pulse rounded-lg bg-muted sm:h-[320px] lg:h-[360px]" />
      </CardContent>
    </Card>
  );
}
