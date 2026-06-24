import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AddHoldingForm } from "@/components/portfolio/add-holding-form";
import { HoldingCard } from "@/components/portfolio/holding-card";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { prisma } from "@/lib/db";
import { getStockQuote, getStockDetail } from "@/lib/stocks";
import { hasMinRole } from "@/lib/rbac";

export default async function PortfolioPage() {
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

  let totalInvested = 0;
  let currentValue = 0;
  const sectorMap = new Map<string, number>();

  const enrichedHoldings = holdings.map((holding) => {
    const quote = getStockQuote(holding.symbol);
    const detail = getStockDetail(holding.symbol);
    const price = quote?.currentPrice ?? holding.buyPrice;
    const currency = quote?.currency ?? "USD";

    const invested = holding.quantity * holding.buyPrice;
    const current = holding.quantity * price;
    totalInvested += invested;
    currentValue += current;

    if (detail?.profile.sector) {
      sectorMap.set(
        detail.profile.sector,
        (sectorMap.get(detail.profile.sector) ?? 0) + current
      );
    }

    return { holding, currentPrice: price, currency };
  });

  const sectorBreakdown = Array.from(sectorMap.entries())
    .map(([sector, value]) => ({
      sector,
      percentage: currentValue > 0 ? (value / currentValue) * 100 : 0
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <DashboardShell userName={session.user.name} userRole={session.user.role}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Portfolio
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your Holdings
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Track your stock positions, monitor gain/loss, and view exposure across sectors.
            </p>
          </div>
          <AddHoldingForm />
        </div>

        {holdings.length > 0 ? (
          <>
            <PortfolioSummary
              totalInvested={totalInvested}
              currentValue={currentValue}
              holdingsCount={holdings.length}
              sectorBreakdown={sectorBreakdown}
            />

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {enrichedHoldings.map(({ holding, currentPrice, currency }) => (
                <HoldingCard
                  key={holding.id}
                  holding={holding}
                  currentPrice={currentPrice}
                  currency={currency}
                />
              ))}
            </section>
          </>
        ) : (
          <section className="rounded-lg border border-dashed bg-card p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">No holdings yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Add your first stock holding to start tracking your portfolio performance.
            </p>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
