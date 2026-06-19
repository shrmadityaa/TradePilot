export type MarketStatus = "Open" | "Closed" | "After-Hours";

export type StockQuote = {
  symbol: string;
  companyName: string;
  currentPrice: number;
  dailyChangePercent: number;
  marketStatus: MarketStatus;
};

type StockProfile = {
  symbol: string;
  companyName: string;
  basePrice: number;
};

const STOCKS: StockProfile[] = [
  { symbol: "AAPL", companyName: "Apple Inc.", basePrice: 214.3 },
  { symbol: "MSFT", companyName: "Microsoft Corporation", basePrice: 486.1 },
  { symbol: "NVDA", companyName: "NVIDIA Corporation", basePrice: 144.8 },
  { symbol: "AMZN", companyName: "Amazon.com, Inc.", basePrice: 182.5 },
  { symbol: "GOOGL", companyName: "Alphabet Inc.", basePrice: 176.2 },
  { symbol: "META", companyName: "Meta Platforms, Inc.", basePrice: 628.9 },
  { symbol: "TSLA", companyName: "Tesla, Inc.", basePrice: 181.4 },
  { symbol: "JPM", companyName: "JPMorgan Chase & Co.", basePrice: 268.2 },
  { symbol: "V", companyName: "Visa Inc.", basePrice: 341.7 },
  { symbol: "UNH", companyName: "UnitedHealth Group Incorporated", basePrice: 307.6 },
  { symbol: "LLY", companyName: "Eli Lilly and Company", basePrice: 874.4 },
  { symbol: "AVGO", companyName: "Broadcom Inc.", basePrice: 252.8 },
  { symbol: "XOM", companyName: "Exxon Mobil Corporation", basePrice: 110.9 },
  { symbol: "COST", companyName: "Costco Wholesale Corporation", basePrice: 990.2 },
  { symbol: "WMT", companyName: "Walmart Inc.", basePrice: 96.5 },
  { symbol: "NFLX", companyName: "Netflix, Inc.", basePrice: 1212.3 },
  { symbol: "AMD", companyName: "Advanced Micro Devices, Inc.", basePrice: 158.6 },
  { symbol: "CRM", companyName: "Salesforce, Inc.", basePrice: 261.7 }
];

function getMarketStatus(date = new Date()): MarketStatus {
  const utcHour = date.getUTCHours();
  const utcDay = date.getUTCDay();
  const isWeekend = utcDay === 0 || utcDay === 6;

  if (isWeekend) {
    return "Closed";
  }

  if (utcHour >= 14 && utcHour < 20) {
    return "Open";
  }

  if (utcHour >= 20 && utcHour < 24) {
    return "After-Hours";
  }

  return "Closed";
}

function seededMovement(symbol: string) {
  const seed = symbol.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const wave = Math.sin(seed + new Date().getUTCDate());

  return Number((wave * 3.7).toFixed(2));
}

export function getStockQuote(symbol: string): StockQuote | null {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const profile = STOCKS.find((stock) => stock.symbol === normalizedSymbol);

  if (!profile) {
    return null;
  }

  const dailyChangePercent = seededMovement(profile.symbol);
  const currentPrice = Number(
    (profile.basePrice * (1 + dailyChangePercent / 100)).toFixed(2)
  );

  return {
    symbol: profile.symbol,
    companyName: profile.companyName,
    currentPrice,
    dailyChangePercent,
    marketStatus: getMarketStatus()
  };
}

export function searchStocks(query: string): StockQuote[] {
  const normalizedQuery = query.trim().toUpperCase();

  if (!normalizedQuery) {
    return [];
  }

  return STOCKS.filter((stock) => {
    return (
      stock.symbol.includes(normalizedQuery) ||
      stock.companyName.toUpperCase().includes(normalizedQuery)
    );
  })
    .slice(0, 8)
    .map((stock) => getStockQuote(stock.symbol))
    .filter((quote): quote is StockQuote => Boolean(quote));
}
