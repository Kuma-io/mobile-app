import { Timeframe } from "@/store/useStore";

export const registerUser = async (walletAddress: string, email: string) => {
  const apiUrl = `https://kuma-server.vercel.app/register-user/${walletAddress}/${email}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log(json);
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
  console.log(json);
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
  console.log(json);
  return json;
};

export const getUserPositions = async (
  walletAddress: string,
  timeframe: Timeframe
) => {
  const apiUrl = `https://kuma-server.vercel.app/get-user-positions/${walletAddress}/${timeframe}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  return json;
};

export const getUserActions = async (walletAddress: string) => {
  const apiUrl = `https://kuma-server.vercel.app/get-user-actions/${walletAddress}`;
  const response = await fetch(apiUrl, {
    headers: {
      "x-api-key": "1234567890",
    },
  });
  const json = await response.json();
  console.log("json", json);
  return json;
};

export const getApy = async () => {
  const timestamp7Days = Math.floor(Date.now() / 1000) - 7 * 86400;
  const apiUrl = `https://aave-api-v2.aave.com/data/rates-history?reserveId=0x833589fcd6edb6e08f4c7c32d4f71b54bda029130xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D8453&from=${timestamp7Days}&resolutionInHours=24`;

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

  return {
    apy: newestRate,
    apyVariation,
    totalSupply,
  };
};

export const getApyHistory = async (timeframe: "W" | "M" | "6M" | "Y") => {
  const now = Math.floor(Date.now() / 1000);

  // Calculate resolution and fromTimestamp based on timeframe
  const timeframeConfig = {
    W: { seconds: 7 * 86400, resolution: 8 }, // 8 hours for 1 week
    M: { seconds: 30 * 86400, resolution: 36 }, // 36 hours for 1 month
    "6M": { seconds: 180 * 86400, resolution: 216 }, // 216 hours for 6 months
    Y: { seconds: 365 * 86400, resolution: 438 }, // 438 hours for 1 year
  };

  const { seconds, resolution } = timeframeConfig[timeframe];
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

  console.log("rateHistory", rateHistory);
  console.log("avgRate", avgRate);

  return {
    avgRate,
    rateHistory,
  };
};
