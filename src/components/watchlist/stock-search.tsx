"use client";

import { Search, Plus } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { addStockToWatchlist } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StockQuote } from "@/lib/stocks";

type SearchResponse = {
  results: StockQuote[];
};

type StockSearchProps = {
  trackedSymbols: string[];
};

export function StockSearch({ trackedSymbols }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockQuote[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const trackedSymbolSet = useMemo(
    () => new Set(trackedSymbols.map((symbol) => symbol.toUpperCase())),
    [trackedSymbols]
  );

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setMessage("");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/stocks?query=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Stock search failed.");
        }

        const data = (await response.json()) as SearchResponse;
        setResults(data.results);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setMessage("Unable to search stocks right now.");
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  function handleAdd(symbol: string) {
    startTransition(async () => {
      const result = await addStockToWatchlist(symbol);
      setMessage(result.message);

      if (result.ok) {
        setQuery("");
        setResults([]);
      }
    });
  }

  return (
    <section className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <Input
            aria-label="Search stock symbols"
            label="Search stocks"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by symbol or company"
            value={query}
          />
        </div>
        <div className="flex min-h-10 items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>Mock market data</span>
        </div>
      </div>

      {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}

      {results.length > 0 ? (
        <div className="mt-4 grid gap-2">
          {results.map((stock) => {
            const isTracked = trackedSymbolSet.has(stock.symbol);

            return (
              <div
                className="flex flex-col gap-3 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                key={stock.symbol}
              >
                <div className="min-w-0">
                  <p className="font-medium">{stock.symbol}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {stock.companyName}
                  </p>
                </div>
                <Button
                  disabled={isTracked || isPending}
                  onClick={() => handleAdd(stock.symbol)}
                  size="sm"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  {isTracked ? "Added" : "Add"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
