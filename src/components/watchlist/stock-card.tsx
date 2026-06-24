import Link from "next/link";
import type { Route } from "next";
import { TrendingDown, TrendingUp, X } from "lucide-react";
import { removeStockFromWatchlistForm } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import type { StockQuote } from "@/lib/stocks";
import { cn } from "@/lib/utils";

type StockCardProps = {
  stock: StockQuote;
};

export function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.dailyChangePercent >= 0;

  return (
    <article className="relative rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:border-primary/40">
      <Link
        aria-label={`View ${stock.symbol} details`}
        className="absolute inset-0 z-[1] rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        href={`/stocks/${stock.symbol}` as Route}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xl font-semibold tracking-tight">
              {stock.symbol}
            </h2>
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              {stock.marketStatus}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {stock.companyName}
          </p>
        </div>
        <form action={removeStockFromWatchlistForm} className="relative z-[2]">
          <input name="symbol" type="hidden" value={stock.symbol} />
          <Button
            aria-label={`Remove ${stock.symbol}`}
            size="icon"
            type="submit"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="text-3xl font-semibold tracking-tight">
          {formatCurrency(stock.currentPrice, stock.currency)}
        </p>
        <div
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium",
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
    </article>
  );
}
