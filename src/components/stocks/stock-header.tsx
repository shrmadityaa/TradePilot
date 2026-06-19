import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { StockDetail } from "@/lib/stocks";
import { cn } from "@/lib/utils";

type StockHeaderProps = {
  stock: StockDetail;
};

export function StockHeader({ stock }: StockHeaderProps) {
  const isPositive = stock.dailyChangePercent >= 0;

  return (
    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="border-b bg-muted/20 px-5 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 text-primary" />
          <span>Live market snapshot</span>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {stock.symbol}
            </h1>
            <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              {stock.marketStatus}
            </span>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground">
            {stock.companyName}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {formatCurrency(stock.currentPrice, stock.currency)}
          </p>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold",
              isPositive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {isPositive ? "+" : ""}
            {stock.dailyChangePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    </section>
  );
}

export function StockHeaderSkeleton() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="border-b bg-muted/20 px-5 py-3">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="h-10 w-36 animate-pulse rounded bg-muted" />
          <div className="h-5 w-64 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-3 lg:text-right">
          <div className="h-10 w-44 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </section>
  );
}
