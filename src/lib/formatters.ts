import type { CurrencyCode } from "@/lib/stocks";

const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  INR: "en-IN",
  USD: "en-US"
};

export function formatCurrency(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 2
  }).format(value);
}
