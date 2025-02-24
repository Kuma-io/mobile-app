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

export const getAaveApy = async () => {
  const timestamp = Math.floor(Date.now() / 1000) - 365 * 86400; // Subtract one year (365 days)
  console.log("timestamp", timestamp);
  const apiUrl = `https://aave-api-v2.aave.com/data/rates-history?reserveId=0x833589fcd6edb6e08f4c7c32d4f71b54bda029130xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D8453&from=${timestamp}&resolutionInHours=40`;
  const response = await fetch(apiUrl);
  const json = await response.json();

  // Calculate averages across all entries
  const liquidityRateSum = json.reduce(
    (sum: number, entry: any) => sum + entry.liquidityRate_avg,
    0
  );
  const utilizationRateSum = json.reduce(
    (sum: number, entry: any) => sum + entry.utilizationRate_avg,
    0
  );

  const liquidityRateAvg = liquidityRateSum / json.length;
  const utilizationRateAvg = utilizationRateSum / json.length;

  console.log("AAVE API", json);
  return {
    liquidityRate: liquidityRateAvg,
    utilizationRate: utilizationRateAvg,
  };
};
