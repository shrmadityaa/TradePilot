"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStockQuote } from "@/lib/stocks";

const symbolSchema = z
  .string()
  .trim()
  .min(1, "Enter a stock symbol.")
  .max(10, "Stock symbols must be 10 characters or fewer.")
  .transform((symbol) => symbol.toUpperCase());

export type WatchlistActionResult = {
  ok: boolean;
  message: string;
};

async function getAuthenticatedUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage a watchlist.");
  }

  return session.user.id;
}

export async function addStockToWatchlist(
  symbol: string
): Promise<WatchlistActionResult> {
  const parsed = symbolSchema.safeParse(symbol);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid symbol." };
  }

  const quote = getStockQuote(parsed.data);

  if (!quote) {
    return { ok: false, message: "That symbol is not available in mock data yet." };
  }

  const userId = await getAuthenticatedUserId();
  const watchlist = await prisma.watchlist.upsert({
    where: { userId },
    create: { userId },
    update: {}
  });

  await prisma.watchlistStock.upsert({
    where: {
      watchlistId_symbol: {
        watchlistId: watchlist.id,
        symbol: quote.symbol
      }
    },
    create: {
      watchlistId: watchlist.id,
      symbol: quote.symbol,
      companyName: quote.companyName
    },
    update: {
      companyName: quote.companyName
    }
  });

  revalidatePath("/dashboard");

  return { ok: true, message: `${quote.symbol} added to your watchlist.` };
}

export async function removeStockFromWatchlist(
  symbol: string
): Promise<WatchlistActionResult> {
  const parsed = symbolSchema.safeParse(symbol);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid symbol." };
  }

  const userId = await getAuthenticatedUserId();
  const watchlist = await prisma.watchlist.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!watchlist) {
    return { ok: false, message: "No watchlist exists yet." };
  }

  await prisma.watchlistStock.deleteMany({
    where: {
      watchlistId: watchlist.id,
      symbol: parsed.data
    }
  });

  revalidatePath("/dashboard");

  return { ok: true, message: `${parsed.data} removed from your watchlist.` };
}

export async function removeStockFromWatchlistForm(
  formData: FormData
): Promise<void> {
  await removeStockFromWatchlist(String(formData.get("symbol") ?? ""));
}
