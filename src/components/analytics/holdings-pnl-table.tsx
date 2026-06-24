import Link from "next/link";
import type { Route } from "next";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { HoldingAnalytics } from "@/lib/analytics";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function HoldingsPnlTable({ holdings }: { holdings: HoldingAnalytics[] }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-4">
        <h3 className="text-lg font-semibold tracking-tight">P&L Breakdown</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Profit and loss for each holding in your portfolio.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Qty</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Buy Price</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Current</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Invested</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Value</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">P&L</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">P&L %</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Day %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const isPnlPositive = h.pnl >= 0;
              const isDayPositive = h.dayChangePercent >= 0;

              return (
                <tr key={h.symbol} className="border-t transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/stocks/${h.symbol}` as Route} className="font-medium hover:text-primary">
                      {h.symbol}
                    </Link>
                    <p className="text-xs text-muted-foreground">{h.companyName}</p>
                  </td>
                  <td className="px-4 py-3 text-right">{h.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(h.buyPrice, h.currency)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(h.currentPrice, h.currency)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(h.investedValue, h.currency)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(h.currentValue, h.currency)}</td>
                  <td className={cn("px-4 py-3 text-right font-medium", isPnlPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                    <span className="inline-flex items-center gap-1">
                      {isPnlPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isPnlPositive ? "+" : ""}{formatCurrency(h.pnl, h.currency)}
                    </span>
                  </td>
                  <td className={cn("px-4 py-3 text-right font-medium", isPnlPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                    {isPnlPositive ? "+" : ""}{h.pnlPercent.toFixed(2)}%
                  </td>
                  <td className={cn("px-4 py-3 text-right", isDayPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                    {isDayPositive ? "+" : ""}{h.dayChangePercent.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
