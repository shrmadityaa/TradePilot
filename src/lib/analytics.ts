import type { CurrencyCode } from "@/lib/stocks";

export type HoldingAnalytics = {
  symbol: string;
  companyName: string;
  currency: CurrencyCode;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  dayChangePercent: number;
  sector: string;
  allocation: number;
};

export type PortfolioAnalyticsSummary = {
  totalInvested: number;
  totalCurrentValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  bestPerformer: HoldingAnalytics | null;
  worstPerformer: HoldingAnalytics | null;
  holdings: HoldingAnalytics[];
  sectorPerformance: SectorPerformance[];
  topGainers: HoldingAnalytics[];
  topLosers: HoldingAnalytics[];
};

export type SectorPerformance = {
  sector: string;
  invested: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
};

export function computeAnalytics(
  holdings: HoldingAnalytics[]
): PortfolioAnalyticsSummary {
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnl = totalCurrentValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  const sorted = [...holdings].sort((a, b) => b.pnlPercent - a.pnlPercent);
  const bestPerformer = sorted[0] ?? null;
  const worstPerformer = sorted[sorted.length - 1] ?? null;

  const topGainers = sorted.filter((h) => h.pnl > 0).slice(0, 5);
  const topLosers = [...holdings]
    .sort((a, b) => a.pnlPercent - b.pnlPercent)
    .filter((h) => h.pnl < 0)
    .slice(0, 5);

  const sectorMap = new Map<string, { invested: number; currentValue: number }>();
  for (const h of holdings) {
    const existing = sectorMap.get(h.sector) ?? { invested: 0, currentValue: 0 };
    existing.invested += h.investedValue;
    existing.currentValue += h.currentValue;
    sectorMap.set(h.sector, existing);
  }

  const sectorPerformance: SectorPerformance[] = Array.from(sectorMap.entries())
    .map(([sector, data]) => ({
      sector,
      invested: data.invested,
      currentValue: data.currentValue,
      pnl: data.currentValue - data.invested,
      pnlPercent: data.invested > 0 ? ((data.currentValue - data.invested) / data.invested) * 100 : 0,
      allocation: totalCurrentValue > 0 ? (data.currentValue / totalCurrentValue) * 100 : 0
    }))
    .sort((a, b) => b.allocation - a.allocation);

  return {
    totalInvested,
    totalCurrentValue,
    totalPnl,
    totalPnlPercent,
    bestPerformer,
    worstPerformer,
    holdings,
    sectorPerformance,
    topGainers,
    topLosers
  };
}
