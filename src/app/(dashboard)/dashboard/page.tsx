import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { StockCard } from "@/components/watchlist/stock-card";
import { StockSearch } from "@/components/watchlist/stock-search";
import { prisma } from "@/lib/db";
import { getStockQuote, type StockQuote } from "@/lib/stocks";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const watchlist = await prisma.watchlist.findUnique({
    where: { userId: session.user.id },
    include: {
      stocks: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  const stocks =
    watchlist?.stocks
      .map((stock) => getStockQuote(stock.symbol))
      .filter((stock): stock is StockQuote => Boolean(stock)) ?? [];

  const usdStocks = stocks.filter((s) => s.currency === "USD");
  const inrStocks = stocks.filter((s) => s.currency === "INR");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Watchlist Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Track your market shortlist
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Search symbols, add companies to your list, and monitor mock quote
            movement from one responsive dashboard.
          </p>
        </div>
        <div className="rounded-lg border bg-card px-4 py-3 text-sm shadow-sm">
          <p className="text-muted-foreground">Tracked stocks</p>
          <p className="text-2xl font-semibold">{stocks.length}</p>
        </div>
      </div>

      <StockSearch trackedSymbols={stocks.map((stock) => stock.symbol)} />

      {stocks.length > 0 ? (
        <div className="space-y-8">
          {usdStocks.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">US Market</h2>
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">USD</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {usdStocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            </section>
          )}

          {inrStocks.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">Indian Market</h2>
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">INR</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {inrStocks.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <section className="rounded-lg border border-dashed bg-card p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">No stocks yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Use search to add your first stock symbol and build a focused watchlist.
          </p>
        </section>
      )}
    </div>
  );
}
