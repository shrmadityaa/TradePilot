import { TrendingDown, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

type SummaryProps = {
  totalInvested: number;
  currentValue: number;
  holdingsCount: number;
  sectorBreakdown: { sector: string; percentage: number }[];
};

export function PortfolioSummary({ totalInvested, currentValue, holdingsCount, sectorBreakdown }: SummaryProps) {
  const totalGainLoss = currentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
  const isPositive = totalGainLoss >= 0;

  const cards = [
    {
      label: "Total Invested",
      value: `$${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign
    },
    {
      label: "Current Value",
      value: `$${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Briefcase
    },
    {
      label: "Total P&L",
      value: `${isPositive ? "+" : ""}$${Math.abs(totalGainLoss).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${isPositive ? "+" : ""}${totalGainLossPercent.toFixed(2)}%)`,
      icon: isPositive ? TrendingUp : TrendingDown,
      colorClass: isPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400"
    },
    {
      label: "Holdings",
      value: String(holdingsCount),
      icon: Briefcase
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </div>
          );
        })}
      </div>

      {sectorBreakdown.length > 0 && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Sector Exposure</h3>
          <div className="space-y-2">
            {sectorBreakdown.map((sector) => (
              <div key={sector.sector} className="flex items-center gap-3">
                <div className="w-28 truncate text-sm font-medium">{sector.sector}</div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min(sector.percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-sm text-muted-foreground">
                  {sector.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
