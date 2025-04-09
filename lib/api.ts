import * as types from "@/types";

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

// GET
export const getUserPositions = async (
  walletAddress: string,
  timeframe: types.UserPositionTimeframe
) => {
  const cacheKey = `getUserPositions-${walletAddress}-${timeframe}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for getUserPositions");
    return cached.data;
  }

  const apiUrl = `https://kuma-server.vercel.app/get-user-positions/${walletAddress}/${timeframe}`;
  console.log("api", apiUrl);
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("getUserPositions", json);

  apiCache.set(cacheKey, {
    data: json,
    timestamp: Date.now(),
  });

  return json;
};

export const getUserActions = async (walletAddress: string) => {
  const cacheKey = `getUserActions-${walletAddress}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for getUserActions");
    return cached.data;
  }

  const apiUrl = `https://kuma-server.vercel.app/get-user-actions/${walletAddress}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("getUserActions", json);

  apiCache.set(cacheKey, {
    data: json,
    timestamp: Date.now(),
  });

  return json;
};

export const getUserNotifications = async (walletAddress: string) => {
  const cacheKey = `getUserNotifications-${walletAddress}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for getUserNotifications");
    return cached.data;
  }

  const apiUrl = `https://kuma-server.vercel.app/get-user-notification/${walletAddress}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("getUserNotifications", json);

  apiCache.set(cacheKey, {
    data: json,
    timestamp: Date.now(),
  });

  return json;
};

export const getApy = async () => {
  const cacheKey = "getApy";
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for getApy");
    return cached.data;
  }

  const timestamp7Days = Math.floor(Date.now() / 1000) - 7 * 86400;
  const apiUrl = `https://aave-api-v2.aave.com/data/rates-history?reserveId=0x833589fcd6edb6e08f4c7c32d4f71b54bda029130xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D8453&from=${timestamp7Days}&resolutionInHours=6`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  // Get the newest rate (last entry)
  const newestRate = data[data.length - 1].liquidityRate_avg;
  const totalSupply = data[data.length - 1].utilizationRate_avg * 240000000;

  // Calculate last week's average (excluding the newest rate)
  const lastWeekAvg =
    data
      .slice(0, -1)
      .reduce((sum: number, entry: any) => sum + entry.liquidityRate_avg, 0) /
    (data.length - 1);

  // Calculate variation (difference between newest and last week's average)
  const apyVariation = ((newestRate - lastWeekAvg) / lastWeekAvg) * 100;

  const result = {
    apy: newestRate,
    apyVariation,
    totalSupply,
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

  const apiUrl = `https://aave-api-v2.aave.com/data/rates-history?reserveId=0x833589fcd6edb6e08f4c7c32d4f71b54bda029130xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D8453&from=${fromTimestamp}&resolutionInHours=${resolution}`;
  console.log("apiUrl", apiUrl);
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Calculate average and sort rates from oldest to newest
  const avgRate =
    data.reduce((sum: number, entry: any) => sum + entry.liquidityRate_avg, 0) /
    data.length;
  const rateHistory = data.map((entry: any) => entry.liquidityRate_avg);

  const result = {
    avgRate,
    rateHistory,
  };

  console.log("getApyHistory", result);

  apiCache.set(cacheKey, {
    data: result,
    timestamp: Date.now(),
  });

  return result;
};

export const getCurrencyRate = async (currencySlug: types.CurrencySlug) => {
  if (currencySlug === "USD") {
    return 1;
  }

  const cacheKey = `getCurrencyRate-${currencySlug}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Cache hit for getCurrencyRate");
    return cached.data;
  }

  const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${currencySlug}&api_key=059fad215d1927895c58d9ec92b3dd995165bfcc8fd797ab2d070d4e10c44c1f`;
  const response = await fetch(apiUrl);
  const json = await response.json();
  console.log("getCurrencyRate", json);

  const result = json[currencySlug];

  apiCache.set(cacheKey, {
    data: result,
    timestamp: Date.now(),
  });

  return result;
};

// POST
export const registerUser = async (walletAddress: string, email: string) => {
  const apiUrl = `https://kuma-server.vercel.app/register-user/${walletAddress}/${email}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("registerUser", json);
  return json;
};

export const registerUserActions = async (
  walletAddress: string,
  action: "DEPOSIT" | "WITHDRAW",
  amount: number
) => {
  const apiUrl = `https://kuma-server.vercel.app/register-user-action/${walletAddress}/${action}/${amount}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("registerUserActions", json);
  return json;
};

export const registerUserPosition = async (walletAddress: string) => {
  const apiUrl = `https://kuma-server.vercel.app/register-user-position/${walletAddress}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("registerUserPosition", json);
  return json;
};

export const registerUserNotification = async (
  walletAddress: string,
  notification: boolean
) => {
  const apiUrl = `https://kuma-server.vercel.app/register-user-notification/${walletAddress}/${notification}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("registerUserNotification", json);
  return json;
};

/**
 * Resets all cached API responses
 * Call this function when user logs out to clear all cached data
 */
export const resetCache = () => {
  apiCache.clear();
  console.log("API cache cleared");
};
