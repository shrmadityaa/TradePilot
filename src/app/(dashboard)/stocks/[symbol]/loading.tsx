import { CompanyProfileSkeleton } from "@/components/stocks/company-profile";
import { MetricCardSkeleton } from "@/components/stocks/metric-card";
import { StockChartSkeleton } from "@/components/stocks/stock-chart";
import { StockHeaderSkeleton } from "@/components/stocks/stock-header";

export default function StockLoading() {
  return (
    <div className="space-y-5">
      <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
      <StockHeaderSkeleton />
      <StockChartSkeleton />
      <section className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3 space-y-2">
          <div className="h-7 w-36 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <MetricCardSkeleton key={index} />
          ))}
        </div>
      </section>
      <CompanyProfileSkeleton />
    </div>
  );
}
