"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import type { Route } from "next";
import { Pencil, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { updateHolding, removeHolding, type PortfolioActionResult } from "@/app/(dashboard)/portfolio/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatters";
import type { CurrencyCode } from "@/lib/stocks";
import { cn } from "@/lib/utils";

type HoldingCardProps = {
  holding: {
    id: string;
    symbol: string;
    companyName: string;
    quantity: number;
    buyPrice: number;
    buyDate: Date;
  };
  currentPrice: number;
  currency: CurrencyCode;
};

const initialState: PortfolioActionResult = { ok: false, message: "" };

export function HoldingCard({ holding, currentPrice, currency }: HoldingCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction] = useActionState(updateHolding, initialState);

  const investedValue = holding.quantity * holding.buyPrice;
  const currentValue = holding.quantity * currentPrice;
  const gainLoss = currentValue - investedValue;
  const gainLossPercent = investedValue > 0 ? (gainLoss / investedValue) * 100 : 0;
  const isPositive = gainLoss >= 0;

  if (state.ok && isEditing) {
    setIsEditing(false);
  }

  return (
    <article className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/stocks/${holding.symbol}` as Route} className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight hover:text-primary">
            {holding.symbol}
          </h3>
          <p className="truncate text-sm text-muted-foreground">{holding.companyName}</p>
        </Link>
        <div className="flex items-center gap-1">
          <Button
            aria-label="Edit holding"
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <form action={removeHolding}>
            <input type="hidden" name="id" value={holding.id} />
            <Button aria-label="Remove holding" size="icon" type="submit" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {isEditing ? (
        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="id" value={holding.id} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Quantity" name="quantity" type="number" step="any" defaultValue={holding.quantity} required />
            <Input label="Buy Price" name="buyPrice" type="number" step="any" defaultValue={holding.buyPrice} required />
            <Input label="Buy Date" name="buyDate" type="date" defaultValue={new Date(holding.buyDate).toISOString().split("T")[0]} required />
          </div>
          {state.message && !state.ok ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}
          <div className="flex gap-2">
            <SaveButton />
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Qty</p>
            <p className="font-medium">{holding.quantity}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Buy Price</p>
            <p className="font-medium">{formatCurrency(holding.buyPrice, currency)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Value</p>
            <p className="font-medium">{formatCurrency(currentValue, currency)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gain / Loss</p>
            <div className={cn(
              "flex items-center gap-1 font-medium",
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}>
              {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {formatCurrency(Math.abs(gainLoss), currency)} ({isPositive ? "+" : ""}{gainLossPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} size="sm" type="submit">
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
