export type CurrencyCode = "USD" | "INR";

export type MarketStatus = "Open" | "Closed" | "After-Hours";

export type HistoricalRange = "1D" | "1W" | "1M" | "6M" | "1Y";

export type StockQuote = {
  symbol: string;
  companyName: string;
  currentPrice: number;
  dailyChangePercent: number;
  marketStatus: MarketStatus;
  currency: CurrencyCode;
};

export type StockMetric = {
  label: string;
  value: string;
};

export type CompanyProfile = {
  description: string;
  industry: string;
  sector: string;
  headquarters: string;
  ceo: string;
};

export type HistoricalPricePoint = {
  label: string;
  value: number;
};

export type StockDetail = StockQuote & {
  metrics: StockMetric[];
  profile: CompanyProfile;
  historical: Record<HistoricalRange, HistoricalPricePoint[]>;
};

type MockStock = {
  symbol: string;
  companyName: string;
  price: number;
  dailyChange: number;
  marketStatus?: MarketStatus;
  currency: CurrencyCode;
  marketCap: string;
  peRatio: string;
  eps: string;
  volume: string;
  profile: CompanyProfile;
};

type StockDataProvider = {
  getQuote: (symbol: string) => StockQuote | null;
  search: (query: string) => StockQuote[];
};

const MOCK_STOCKS: MockStock[] = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    price: 214.3,
    dailyChange: -0.97,
    currency: "USD",
    marketCap: "$3.29T",
    peRatio: "32.7",
    eps: "$6.57",
    volume: "58.4M",
    profile: {
      description:
        "Apple designs consumer electronics, software, and services across iPhone, Mac, iPad, wearables, and digital subscriptions.",
      industry: "Consumer Electronics",
      sector: "Technology",
      headquarters: "Cupertino, California",
      ceo: "Tim Cook"
    }
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    price: 486.1,
    dailyChange: 1.28,
    currency: "USD",
    marketCap: "$3.61T",
    peRatio: "37.4",
    eps: "$12.99",
    volume: "24.7M",
    profile: {
      description:
        "Microsoft builds cloud infrastructure, productivity software, developer tools, gaming platforms, and AI-powered business applications.",
      industry: "Software Infrastructure",
      sector: "Technology",
      headquarters: "Redmond, Washington",
      ceo: "Satya Nadella"
    }
  },
  {
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    price: 181.4,
    dailyChange: -2.31,
    currency: "USD",
    marketCap: "$578.9B",
    peRatio: "49.8",
    eps: "$3.64",
    volume: "91.2M",
    profile: {
      description:
        "Tesla develops electric vehicles, battery systems, energy storage products, charging infrastructure, and autonomous driving software.",
      industry: "Auto Manufacturers",
      sector: "Consumer Cyclical",
      headquarters: "Austin, Texas",
      ceo: "Elon Musk"
    }
  },
  {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    price: 144.8,
    dailyChange: 2.74,
    currency: "USD",
    marketCap: "$3.56T",
    peRatio: "44.2",
    eps: "$3.28",
    volume: "198.6M",
    profile: {
      description:
        "NVIDIA designs accelerated computing platforms, graphics processors, networking products, and AI data center systems.",
      industry: "Semiconductors",
      sector: "Technology",
      headquarters: "Santa Clara, California",
      ceo: "Jensen Huang"
    }
  },
  {
    symbol: "META",
    companyName: "Meta Platforms, Inc.",
    price: 628.9,
    dailyChange: 0.86,
    currency: "USD",
    marketCap: "$1.59T",
    peRatio: "28.5",
    eps: "$22.05",
    volume: "13.8M",
    profile: {
      description:
        "Meta operates social platforms, messaging products, advertising systems, and long-term investments in AI and immersive computing.",
      industry: "Internet Content & Information",
      sector: "Communication Services",
      headquarters: "Menlo Park, California",
      ceo: "Mark Zuckerberg"
    }
  },
  {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    price: 176.2,
    dailyChange: -0.34,
    currency: "USD",
    marketCap: "$2.16T",
    peRatio: "23.1",
    eps: "$7.63",
    volume: "31.5M",
    profile: {
      description:
        "Alphabet operates Google Search, YouTube, Android, cloud services, advertising platforms, and AI research initiatives.",
      industry: "Internet Content & Information",
      sector: "Communication Services",
      headquarters: "Mountain View, California",
      ceo: "Sundar Pichai"
    }
  },
  {
    symbol: "AMZN",
    companyName: "Amazon.com, Inc.",
    price: 182.5,
    dailyChange: 1.11,
    currency: "USD",
    marketCap: "$1.93T",
    peRatio: "35.6",
    eps: "$5.13",
    volume: "45.9M",
    profile: {
      description:
        "Amazon provides online retail, marketplace logistics, subscriptions, advertising, devices, and cloud infrastructure through AWS.",
      industry: "Internet Retail",
      sector: "Consumer Cyclical",
      headquarters: "Seattle, Washington",
      ceo: "Andy Jassy"
    }
  },
  {
    symbol: "TCS",
    companyName: "Tata Consultancy Services Limited",
    price: 3895.5,
    dailyChange: 0.42,
    currency: "INR",
    marketCap: "₹14.1T",
    peRatio: "29.8",
    eps: "₹130.62",
    volume: "2.1M",
    profile: {
      description:
        "TCS provides IT services, consulting, cloud transformation, business solutions, and engineering services to global enterprises.",
      industry: "Information Technology Services",
      sector: "Technology",
      headquarters: "Mumbai, Maharashtra",
      ceo: "K. Krithivasan"
    }
  },
  {
    symbol: "INFY",
    companyName: "Infosys Limited",
    price: 1498.4,
    dailyChange: -0.65,
    currency: "INR",
    marketCap: "₹6.2T",
    peRatio: "23.4",
    eps: "₹64.04",
    volume: "5.6M",
    profile: {
      description:
        "Infosys delivers digital services, consulting, cloud modernization, enterprise platforms, and business process transformation.",
      industry: "Information Technology Services",
      sector: "Technology",
      headquarters: "Bengaluru, Karnataka",
      ceo: "Salil Parekh"
    }
  },
  {
    symbol: "RELIANCE",
    companyName: "Reliance Industries Limited",
    price: 2868.7,
    dailyChange: 1.36,
    currency: "INR",
    marketCap: "₹19.4T",
    peRatio: "28.1",
    eps: "₹102.08",
    volume: "7.8M",
    profile: {
      description:
        "Reliance operates energy, petrochemicals, retail, telecommunications, media, and digital services businesses across India.",
      industry: "Oil & Gas Integrated",
      sector: "Energy",
      headquarters: "Mumbai, Maharashtra",
      ceo: "Mukesh Ambani"
    }
  },
  {
    symbol: "HDFCBANK",
    companyName: "HDFC Bank Limited",
    price: 1687.2,
    dailyChange: 0.91,
    currency: "INR",
    marketCap: "₹12.9T",
    peRatio: "18.6",
    eps: "₹90.71",
    volume: "12.4M",
    profile: {
      description:
        "HDFC Bank provides retail banking, wholesale banking, credit cards, loans, deposits, and treasury services across India.",
      industry: "Banks - Regional",
      sector: "Financial Services",
      headquarters: "Mumbai, Maharashtra",
      ceo: "Sashidhar Jagdishan"
    }
  },
  {
    symbol: "ICICIBANK",
    companyName: "ICICI Bank Limited",
    price: 1124.6,
    dailyChange: 1.18,
    currency: "INR",
    marketCap: "₹7.9T",
    peRatio: "19.9",
    eps: "₹56.51",
    volume: "14.2M",
    profile: {
      description:
        "ICICI Bank offers banking, insurance, wealth management, investment banking, and digital financial products.",
      industry: "Banks - Regional",
      sector: "Financial Services",
      headquarters: "Mumbai, Maharashtra",
      ceo: "Sandeep Bakhshi"
    }
  },
  {
    symbol: "WIPRO",
    companyName: "Wipro Limited",
    price: 482.75,
    dailyChange: -0.48,
    currency: "INR",
    marketCap: "₹2.5T",
    peRatio: "22.7",
    eps: "₹21.27",
    volume: "6.9M",
    profile: {
      description:
        "Wipro provides IT consulting, application services, cloud engineering, cybersecurity, and digital operations services.",
      industry: "Information Technology Services",
      sector: "Technology",
      headquarters: "Bengaluru, Karnataka",
      ceo: "Srini Pallia"
    }
  },
  {
    symbol: "TATAMOTORS",
    companyName: "Tata Motors Limited",
    price: 978.3,
    dailyChange: 2.05,
    currency: "INR",
    marketCap: "₹3.6T",
    peRatio: "11.4",
    eps: "₹85.82",
    volume: "18.7M",
    profile: {
      description:
        "Tata Motors manufactures passenger vehicles, commercial vehicles, electric vehicles, and luxury vehicles through Jaguar Land Rover.",
      industry: "Auto Manufacturers",
      sector: "Consumer Cyclical",
      headquarters: "Mumbai, Maharashtra",
      ceo: "Girish Wagh"
    }
  }
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

function toStockQuote(stock: MockStock): StockQuote {
  return {
    symbol: stock.symbol,
    companyName: stock.companyName,
    currentPrice: stock.price,
    dailyChangePercent: stock.dailyChange,
    marketStatus: stock.marketStatus ?? getMarketStatus(),
    currency: stock.currency
  };
}

function getSeed(symbol: string) {
  return symbol.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function getHistoricalLabels(range: HistoricalRange, points: number): string[] {
  if (range === "1D") {
    return Array.from({ length: points }, (_, index) => {
      const hour = 9 + Math.floor((index * 7) / 16);
      const minute = index % 2 === 0 ? "30" : "00";
      return `${hour}:${minute}`;
    });
  }

  if (range === "1W") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
  }

  return Array.from({ length: points }, (_, index) => {
    const remaining = points - index - 1;

    if (range === "1M") {
      return remaining === 0 ? "Today" : `${remaining}D`;
    }

    if (range === "6M") {
      return remaining === 0 ? "Today" : `${remaining}W`;
    }

    return remaining === 0 ? "Today" : `${remaining}W`;
  });
}

function generateHistoricalSeries(
  stock: MockStock,
  range: HistoricalRange
): HistoricalPricePoint[] {
  const pointsByRange: Record<HistoricalRange, number> = {
    "1D": 18,
    "1W": 7,
    "1M": 30,
    "6M": 26,
    "1Y": 52
  };
  const volatilityByRange: Record<HistoricalRange, number> = {
    "1D": 0.012,
    "1W": 0.028,
    "1M": 0.07,
    "6M": 0.16,
    "1Y": 0.28
  };
  const points = pointsByRange[range];
  const seed = getSeed(stock.symbol);
  const volatility = volatilityByRange[range];
  const labels = getHistoricalLabels(range, points);

  return labels.map((label, index) => {
    const progress = index / Math.max(points - 1, 1);
    const wave = Math.sin((index + seed) * 0.85) * volatility;
    const drift = (progress - 1) * (stock.dailyChange / 100) * 1.8;
    const counterWave = Math.cos((index + seed) * 0.37) * volatility * 0.42;
    const normalizedValue =
      stock.price * (1 + wave + counterWave + drift - stock.dailyChange / 100);
    const value = index === points - 1 ? stock.price : normalizedValue;

    return {
      label,
      value: Number(value.toFixed(2))
    };
  });
}

function toStockDetail(stock: MockStock): StockDetail {
  return {
    ...toStockQuote(stock),
    metrics: [
      { label: "Market Cap", value: stock.marketCap },
      { label: "P/E Ratio", value: stock.peRatio },
      { label: "EPS", value: stock.eps },
      { label: "Volume", value: stock.volume }
    ],
    profile: stock.profile,
    historical: {
      "1D": generateHistoricalSeries(stock, "1D"),
      "1W": generateHistoricalSeries(stock, "1W"),
      "1M": generateHistoricalSeries(stock, "1M"),
      "6M": generateHistoricalSeries(stock, "6M"),
      "1Y": generateHistoricalSeries(stock, "1Y")
    }
  };
}

const mockStockProvider: StockDataProvider = {
  getQuote(symbol) {
    const normalizedSymbol = symbol.trim().toUpperCase();
    const stock = MOCK_STOCKS.find((item) => item.symbol === normalizedSymbol);

    return stock ? toStockQuote(stock) : null;
  },
  search(query) {
    const normalizedQuery = query.trim().toUpperCase();

    if (!normalizedQuery) {
      return [];
    }

    return MOCK_STOCKS.filter((stock) => {
      return (
        stock.symbol.includes(normalizedQuery) ||
        stock.companyName.toUpperCase().includes(normalizedQuery)
      );
    })
      .slice(0, 8)
      .map(toStockQuote);
  }
};

const stockProvider: StockDataProvider = mockStockProvider;

export function getStockQuote(symbol: string): StockQuote | null {
  return stockProvider.getQuote(symbol);
}

export function getStockDetail(symbol: string): StockDetail | null {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const stock = MOCK_STOCKS.find((item) => item.symbol === normalizedSymbol);

  return stock ? toStockDetail(stock) : null;
}

export function searchStocks(query: string): StockQuote[] {
  return stockProvider.search(query);
}
