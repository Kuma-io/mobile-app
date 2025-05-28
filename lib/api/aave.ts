import * as types from "@/types";

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60;
const BASE_URL =
  "https://aave-api-v2.aave.com/data/rates-history?reserveId=0x833589fcd6edb6e08f4c7c32d4f71b54bda029130xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D8453";

export const getApy = async () => {
  const cacheKey = "getApy";
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for getApy");
    return cached.data;
  }

  const timestamp7DaysAgo = Math.floor(Date.now() / 1000) - 7 * 86400;
  const url = `${BASE_URL}&from=${timestamp7DaysAgo}&resolutionInHours=6`;

  const response = await fetch(url);
  const data = await response.json();

  const apy = data[data.length - 1].liquidityRate_avg;
  const aus = data[data.length - 1].utilizationRate_avg * 240000000;

  const weekApy =
    data
      .slice(0, -1)
      .reduce((sum: number, entry: any) => sum + entry.liquidityRate_avg, 0) /
    (data.length - 1);

  const apyVariation = ((apy - weekApy) / weekApy) * 100;

  const result = {
    apy,
    aus,
    apyVariation,
  };

  console.log("getApy", result);

  apiCache.set(cacheKey, {
    data: result,
    timestamp: Date.now(),
  });

  return result;
};

export const getApyHistory = async (timeframe: types.ApyTimeframe) => {
  const cacheKey = `getApyHistory-${timeframe}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for getApyHistory");
    return cached.data;
  }

  const now = Math.floor(Date.now() / 1000);

  // Calculate resolution and fromTimestamp based on timeframe
  const timeframeConfig = {
    "1W": { seconds: 7 * 86400, resolution: 6 }, // 6 hours for 1 week
    "1M": { seconds: 30 * 86400, resolution: 36 }, // 36 hours for 1 month
    "6M": { seconds: 180 * 86400, resolution: 216 }, // 216 hours for 6 months
    "1Y": { seconds: 365 * 86400, resolution: 438 }, // 438 hours for 1 year
  };

  const { seconds, resolution } =
    timeframeConfig[timeframe as keyof typeof timeframeConfig];
  const fromTimestamp = now - seconds;

  const url = `${BASE_URL}&from=${fromTimestamp}&resolutionInHours=${resolution}`;
  console.log("url", url);
  const response = await fetch(url);
  const data = await response.json();

  const apy =
    data.reduce((sum: number, entry: any) => sum + entry.liquidityRate_avg, 0) /
    data.length;
  const apyHistory = data.map((entry: any) => entry.liquidityRate_avg);

  const result = {
    apy,
    apyHistory,
  };

  console.log("getApyHistory", result);

  apiCache.set(cacheKey, {
    data: result,
    timestamp: Date.now(),
  });

  return result;
};
