import * as types from "@/types";

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60;
const BASE_URL = "https://min-api.cryptocompare.com/data/price?fsym=USD";

export const getCurrencyRate = async (
  currencySlug: types.CurrencySlug,
  skipCache: boolean = false
) => {
  if (currencySlug === "USD") return 1;

  const cacheKey = `getCurrencyRate-${currencySlug}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL && !skipCache) {
    console.log("Cache hit for getCurrencyRate");
    return cached.data;
  }

  const url = `${BASE_URL}&tsyms=${currencySlug}&api_key=059fad215d1927895c58d9ec92b3dd995165bfcc8fd797ab2d070d4e10c44c1f`;
  const response = await fetch(url);
  const json = await response.json();
  console.log("getCurrencyRate", json);

  const result = json[currencySlug];

  apiCache.set(cacheKey, {
    data: result,
    timestamp: Date.now(),
  });

  return result;
};
