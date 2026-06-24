"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Search } from "lucide-react";
import { addHolding, type PortfolioActionResult } from "@/app/(dashboard)/portfolio/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StockQuote } from "@/lib/stocks";

type SearchResponse = { results: StockQuote[] };

const initialState: PortfolioActionResult = { ok: false, message: "" };

export function AddHoldingForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(addHolding, initialState);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockQuote[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");

  useEffect(() => {
    if (state.ok) {
      setIsOpen(false);
      setQuery("");
      setSelectedSymbol("");
      setResults([]);
    }
  }, [state]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/stocks?query=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });
        if (res.ok) {
          const data = (await res.json()) as SearchResponse;
          setResults(data.results);
        }
      } catch {
        // ignore abort errors
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} type="button">
        <Plus className="h-4 w-4" />
        Add Holding
      </Button>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add a holding</h3>
        <Button
          onClick={() => { setIsOpen(false); setSelectedSymbol(""); setQuery(""); setResults([]); }}
          size="sm"
          type="button"
          variant="ghost"
        >
          Cancel
        </Button>
      </div>

      {!selectedSymbol ? (
        <div>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by symbol or company"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {results.length > 0 && (
            <div className="mt-3 grid gap-2">
              {results.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => { setSelectedSymbol(stock.symbol); setQuery(stock.symbol); }}
                  className="flex items-center justify-between rounded-md border bg-background p-3 text-left transition-colors hover:border-primary/40"
                >
                  <div>
                    <p className="font-medium">{stock.symbol}</p>
                    <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="symbol" value={selectedSymbol} />
          <div className="flex items-center gap-2">
            <span className="rounded-md border bg-muted px-3 py-1.5 text-sm font-medium">
              {selectedSymbol}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setSelectedSymbol(""); setQuery(""); }}
            >
              Change
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Quantity" name="quantity" type="number" step="any" min="0" required />
            <Input label="Buy Price" name="buyPrice" type="number" step="any" min="0" required />
            <Input label="Buy Date" name="buyDate" type="date" required />
          </div>
          {state.message && !state.ok ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}
          <SubmitButton />
        </form>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      <Plus className="h-4 w-4" />
      {pending ? "Adding..." : "Add to Portfolio"}
    </Button>
  );
}
