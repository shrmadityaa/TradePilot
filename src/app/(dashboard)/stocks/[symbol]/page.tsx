import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, Briefcase, Plus, SearchX } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CompanyProfile } from "@/components/stocks/company-profile";
import { MetricCard } from "@/components/stocks/metric-card";
import { StockChart } from "@/components/stocks/stock-chart";
import { StockHeader } from "@/components/stocks/stock-header";
import { Button } from "@/components/ui/button";
import { getStockDetail } from "@/lib/stocks";
import { prisma } from "@/lib/db";
import { hasMinRole } from "@/lib/rbac";

type StockPageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

export default async function StockPage({ params }: StockPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { symbol } = await params;
  const normalizedSymbol = symbol.toUpperCase();
  const stock = getStockDetail(normalizedSymbol);

  const canHoldPortfolio = hasMinRole(session.user.role, "RETAIL_INVESTOR");

  let isInPortfolio = false;
  if (stock && canHoldPortfolio) {
    const holding = await prisma.portfolioHolding.findUnique({
      where: { userId_symbol: { userId: session.user.id, symbol: stock.symbol } },
      select: { id: true }
    });
    isInPortfolio = Boolean(holding);
  }

  return (
    <DashboardShell userName={session.user.name} userRole={session.user.role}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>

          {stock && canHoldPortfolio && (
            <div className="flex items-center gap-2">
              {isInPortfolio ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={"/portfolio" as Route}>
                    <Briefcase className="h-4 w-4" />
                    View in Portfolio
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link href={`/portfolio?add=${stock.symbol}` as Route}>
                    <Plus className="h-4 w-4" />
                    Add to Portfolio
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {stock ? (
          <>
            <StockHeader stock={stock} />

            <StockChart
              currency={stock.currency}
              currentPrice={stock.currentPrice}
              dailyChangePercent={stock.dailyChangePercent}
              historical={stock.historical}
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <section className="rounded-lg border bg-card p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold tracking-tight">Key Metrics</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Core valuation and trading activity.
                  </p>
                </div>
                <div className="grid gap-3 grid-cols-2">
                  {stock.metrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                  ))}
                </div>
              </section>

              <CompanyProfile profile={stock.profile} />
            </div>
          </>
        ) : (
          <section className="rounded-lg border border-dashed bg-card p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">
              Stock not found
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              {normalizedSymbol} is not available in the current mock stock data.
            </p>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}
