import { Card } from "@/components/ui/card";
import type { StockMetric } from "@/lib/stocks";

type MetricCardProps = {
  metric: StockMetric;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <Card className="bg-background p-4 shadow-none transition-colors hover:border-primary/40">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {metric.label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{metric.value}</p>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card className="bg-background p-4 shadow-none">
      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-6 w-24 animate-pulse rounded bg-muted" />
    </Card>
  );
}
