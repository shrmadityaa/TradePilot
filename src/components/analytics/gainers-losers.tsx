import Link from "next/link";
import type { Route } from "next";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { HoldingAnalytics } from "@/lib/analytics";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

function HoldingRow({ h }: { h: HoldingAnalytics }) {
  const isPositive = h.pnl >= 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
      <div className="min-w-0">
        <Link href={`/stocks/${h.symbol}` as Route} className="font-medium hover:text-primary">
          {h.symbol}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{h.companyName}</p>
      </div>
      <div className="text-right">
        <p className={cn(
          "flex items-center gap-1 text-sm font-semibold",
          isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
        )}>
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {isPositive ? "+" : ""}{h.pnlPercent.toFixed(2)}%
        </p>
        <p className="text-xs text-muted-foreground">
          {isPositive ? "+" : ""}{formatCurrency(h.pnl, h.currency)}
        </p>
      </div>
    </div>
  );
}

export function GainersLosers({
  gainers,
  losers
}: {
  gainers: HoldingAnalytics[];
  losers: HoldingAnalytics[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <h3 className="text-lg font-semibold tracking-tight">Top Gainers</h3>
        </div>
        {gainers.length > 0 ? (
          <div className="space-y-2">
            {gainers.map((h) => (
              <HoldingRow key={h.symbol} h={h} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No gainers yet.</p>
        )}
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-rose-500" />
          <h3 className="text-lg font-semibold tracking-tight">Top Losers</h3>
        </div>
        {losers.length > 0 ? (
          <div className="space-y-2">
            {losers.map((h) => (
              <HoldingRow key={h.symbol} h={h} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No losers yet.</p>
        )}
      </div>
    </div>
  );
}
