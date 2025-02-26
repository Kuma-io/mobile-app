export const CurrencySign = [
  { slug: "USD", sign: "$" },
  { slug: "EUR", sign: "€" },
  { slug: "GBP", sign: "£" },
] as const;

export type CurrencySlug = "USD" | "EUR" | "GBP";
