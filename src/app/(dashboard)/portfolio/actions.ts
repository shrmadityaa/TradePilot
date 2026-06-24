"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getStockQuote } from "@/lib/stocks";

const holdingSchema = z.object({
  symbol: z
    .string()
    .trim()
    .min(1, "Enter a stock symbol.")
    .max(10)
    .transform((s) => s.toUpperCase()),
  quantity: z.coerce.number().positive("Quantity must be greater than 0."),
  buyPrice: z.coerce.number().positive("Buy price must be greater than 0."),
  buyDate: z.coerce.date({ message: "Enter a valid date." })
});

const updateHoldingSchema = z.object({
  id: z.string().min(1),
  quantity: z.coerce.number().positive("Quantity must be greater than 0."),
  buyPrice: z.coerce.number().positive("Buy price must be greater than 0."),
  buyDate: z.coerce.date({ message: "Enter a valid date." })
});

export type PortfolioActionResult = {
  ok: boolean;
  message: string;
};

async function getAuthenticatedUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be signed in.");
  }

  return session.user.id;
}

export async function addHolding(
  _prevState: PortfolioActionResult,
  formData: FormData
): Promise<PortfolioActionResult> {
  const parsed = holdingSchema.safeParse({
    symbol: formData.get("symbol"),
    quantity: formData.get("quantity"),
    buyPrice: formData.get("buyPrice"),
    buyDate: formData.get("buyDate")
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { ok: false, message: firstError };
  }

  const quote = getStockQuote(parsed.data.symbol);

  if (!quote) {
    return { ok: false, message: "That symbol is not available in mock data." };
  }

  const userId = await getAuthenticatedUserId();

  const existing = await prisma.portfolioHolding.findUnique({
    where: { userId_symbol: { userId, symbol: quote.symbol } }
  });

  if (existing) {
    return { ok: false, message: `${quote.symbol} is already in your portfolio. Edit the existing holding instead.` };
  }

  await prisma.portfolioHolding.create({
    data: {
      userId,
      symbol: quote.symbol,
      companyName: quote.companyName,
      quantity: parsed.data.quantity,
      buyPrice: parsed.data.buyPrice,
      buyDate: parsed.data.buyDate
    }
  });

  revalidatePath("/portfolio");

  return { ok: true, message: `${quote.symbol} added to portfolio.` };
}

export async function updateHolding(
  _prevState: PortfolioActionResult,
  formData: FormData
): Promise<PortfolioActionResult> {
  const parsed = updateHoldingSchema.safeParse({
    id: formData.get("id"),
    quantity: formData.get("quantity"),
    buyPrice: formData.get("buyPrice"),
    buyDate: formData.get("buyDate")
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { ok: false, message: firstError };
  }

  const userId = await getAuthenticatedUserId();

  const holding = await prisma.portfolioHolding.findFirst({
    where: { id: parsed.data.id, userId }
  });

  if (!holding) {
    return { ok: false, message: "Holding not found." };
  }

  await prisma.portfolioHolding.update({
    where: { id: parsed.data.id },
    data: {
      quantity: parsed.data.quantity,
      buyPrice: parsed.data.buyPrice,
      buyDate: parsed.data.buyDate
    }
  });

  revalidatePath("/portfolio");

  return { ok: true, message: `${holding.symbol} updated.` };
}

export async function removeHolding(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  if (!id) return;

  const userId = await getAuthenticatedUserId();

  await prisma.portfolioHolding.deleteMany({
    where: { id, userId }
  });

  revalidatePath("/portfolio");
}
