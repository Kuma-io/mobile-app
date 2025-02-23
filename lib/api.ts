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
