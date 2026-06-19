import { NextResponse } from "next/server";
import { searchStocks } from "@/lib/stocks";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  return NextResponse.json({ results: searchStocks(query) });
}
