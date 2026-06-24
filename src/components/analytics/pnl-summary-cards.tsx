import { TrendingDown, TrendingUp, DollarSign, Briefcase, Award, AlertTriangle } from "lucide-react";
import type { PortfolioAnalyticsSummary } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function formatMoney(value: number) {
  return `$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function PnlSummaryCards({ data }: { data: PortfolioAnalyticsSummary }) {
  const isPositive = data.totalPnl >= 0;

  const cards = [
    {
      label: "Total Invested",
      value: formatMoney(data.totalInvested),
      icon: DollarSign,
    },
    {
      label: "Current Value",
      value: formatMoney(data.totalCurrentValue),
      icon: Briefcase,
    },
    {
      label: "Total P&L",
      value: `${isPositive ? "+" : "-"}${formatMoney(data.totalPnl)}`,
      subtitle: `${isPositive ? "+" : ""}${data.totalPnlPercent.toFixed(2)}%`,
      icon: isPositive ? TrendingUp : TrendingDown,
      colorClass: isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Best Performer",
      value: data.bestPerformer?.symbol ?? "—",
      subtitle: data.bestPerformer ? `+${data.bestPerformer.pnlPercent.toFixed(2)}%` : "",
      icon: Award,
      colorClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Worst Performer",
      value: data.worstPerformer?.symbol ?? "—",
      subtitle: data.worstPerformer ? `${data.worstPerformer.pnlPercent.toFixed(2)}%` : "",
      icon: AlertTriangle,
      colorClass: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Holdings",
      value: String(data.holdings.length),
      icon: Briefcase,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <p className="text-sm">{card.label}</p>
            </div>
            <p className={cn("mt-2 text-xl font-semibold", card.colorClass)}>
              {card.value}
            </p>
            {card.subtitle && (
              <p className={cn("text-sm", card.colorClass)}>{card.subtitle}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
