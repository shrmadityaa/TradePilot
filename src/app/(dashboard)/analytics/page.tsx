import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PnlSummaryCards } from "@/components/analytics/pnl-summary-cards";
import { HoldingsPnlTable } from "@/components/analytics/holdings-pnl-table";
import { SectorPerformance } from "@/components/analytics/sector-performance";
import { GainersLosers } from "@/components/analytics/gainers-losers";
import { prisma } from "@/lib/db";
import { getStockQuote, getStockDetail } from "@/lib/stocks";
import { computeAnalytics, type HoldingAnalytics } from "@/lib/analytics";
import { hasMinRole } from "@/lib/rbac";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!hasMinRole(session.user.role, "RETAIL_INVESTOR")) {
    redirect("/dashboard");
  }

  const holdings = await prisma.portfolioHolding.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  const totalCurrentValue = holdings.reduce((sum, h) => {
    const quote = getStockQuote(h.symbol);
    return sum + h.quantity * (quote?.currentPrice ?? h.buyPrice);
  }, 0);

  const holdingAnalytics: HoldingAnalytics[] = holdings.map((h) => {
    const quote = getStockQuote(h.symbol);
    const detail = getStockDetail(h.symbol);
    const currentPrice = quote?.currentPrice ?? h.buyPrice;
    const currency = quote?.currency ?? "USD";
    const investedValue = h.quantity * h.buyPrice;
    const currentValue = h.quantity * currentPrice;
    const pnl = currentValue - investedValue;

    return {
      symbol: h.symbol,
      companyName: h.companyName,
      currency,
      quantity: h.quantity,
      buyPrice: h.buyPrice,
      currentPrice,
      investedValue,
      currentValue,
      pnl,
      pnlPercent: investedValue > 0 ? (pnl / investedValue) * 100 : 0,
      dayChangePercent: quote?.dailyChangePercent ?? 0,
      sector: detail?.profile.sector ?? "Other",
      allocation: totalCurrentValue > 0 ? (currentValue / totalCurrentValue) * 100 : 0
    };
  });

  const analytics = computeAnalytics(holdingAnalytics);

  return (
    <DashboardShell userName={session.user.name} userRole={session.user.role}>
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Analytics
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            P&L Dashboard
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Detailed profit & loss analysis, sector performance, and portfolio insights.
          </p>
        </div>

        {holdings.length > 0 ? (
          <>
            <PnlSummaryCards data={analytics} />

            <GainersLosers
              gainers={analytics.topGainers}
              losers={analytics.topLosers}
            />

            <SectorPerformance sectors={analytics.sectorPerformance} />

            <HoldingsPnlTable holdings={holdingAnalytics} />
          </>
        ) : (
          <section className="rounded-lg border border-dashed bg-card p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">No data yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Add holdings to your portfolio to see P&L analytics and performance breakdowns.
            </p>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
