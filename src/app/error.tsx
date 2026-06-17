"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          TradePilot hit an unexpected error while rendering this page.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
