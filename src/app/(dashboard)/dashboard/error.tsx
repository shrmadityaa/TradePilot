"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <div className="max-w-md space-y-3">
        <h2 className="text-xl font-semibold">Dashboard failed to load</h2>
        <p className="text-sm text-muted-foreground">
          The protected dashboard encountered an unexpected error.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
