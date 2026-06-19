import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CompanyProfile } from "@/components/stocks/company-profile";
import { MetricCard } from "@/components/stocks/metric-card";
import { StockChart } from "@/components/stocks/stock-chart";
import { StockHeader } from "@/components/stocks/stock-header";
import { Button } from "@/components/ui/button";
import { getStockDetail } from "@/lib/stocks";

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

  return (
    <DashboardShell userName={session.user.name}>
      <div className="space-y-5">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>

        {stock ? (
          <>
            <StockHeader stock={stock} />

            <StockChart
              currency={stock.currency}
              currentPrice={stock.currentPrice}
              dailyChangePercent={stock.dailyChangePercent}
              historical={stock.historical}
            />

            <section className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-3">
                <h2 className="text-xl font-semibold tracking-tight">Key Metrics</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Core valuation and trading activity at a glance.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stock.metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} />
                ))}
              </div>
            </section>

            <CompanyProfile profile={stock.profile} />
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
