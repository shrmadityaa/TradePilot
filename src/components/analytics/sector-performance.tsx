import { TrendingDown, TrendingUp } from "lucide-react";
import type { SectorPerformance as SectorPerformanceType } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SECTOR_COLORS = [
  "bg-primary",
  "bg-blue-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
];

export function SectorPerformance({ sectors }: { sectors: SectorPerformanceType[] }) {
  if (sectors.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">Sector Performance</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        How each sector in your portfolio is performing.
      </p>

      <div className="mt-4 flex h-4 overflow-hidden rounded-full">
        {sectors.map((sector, i) => (
          <div
            key={sector.sector}
            className={cn("h-full transition-all", SECTOR_COLORS[i % SECTOR_COLORS.length])}
            style={{ width: `${sector.allocation}%` }}
            title={`${sector.sector}: ${sector.allocation.toFixed(1)}%`}
          />
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {sectors.map((sector, i) => {
          const isPositive = sector.pnl >= 0;
          return (
            <div key={sector.sector} className="flex items-center gap-3">
              <div className={cn("h-3 w-3 rounded-full", SECTOR_COLORS[i % SECTOR_COLORS.length])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{sector.sector}</span>
                  <span className="text-sm text-muted-foreground">{sector.allocation.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className={cn("h-1.5 rounded-full", SECTOR_COLORS[i % SECTOR_COLORS.length])}
                        style={{ width: `${Math.min(sector.allocation, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? "+" : ""}{sector.pnlPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
