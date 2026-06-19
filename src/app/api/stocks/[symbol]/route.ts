import { NextResponse } from "next/server";
import { getStockQuote } from "@/lib/stocks";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const quote = getStockQuote(symbol);

  if (!quote) {
    return NextResponse.json({ error: "Stock symbol not found." }, { status: 404 });
  }

  return NextResponse.json({ quote });
}
