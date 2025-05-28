import * as types from "@/types";

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60;
const BASE_URL = "https://kuma-server.vercel.app/user";

// - USERS
export const setUser = async (
  wallet: string,
  email: string,
  skipCache: boolean = false
): Promise<types.User> => {
  const cacheKey = `setUser-${wallet}-${email}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL && !skipCache) {
    console.log("Cache hit for setUser");
    return cached.data;
  }
  const url = `${BASE_URL}/set/${wallet}/${email}`;
  const response = await fetch(url);
  const user = await response.json();
  apiCache.set(cacheKey, {
    data: user,
    timestamp: Date.now(),
  });
  return user;
};

// - NOTIFICATIONS
export const setUserNotification = async (
  user: types.User,
  notification: boolean
): Promise<boolean> => {
  const url = `${BASE_URL}/notifications/set/${user.wallet}/${notification}`;

  const response = await fetch(url);
  const userNotification = await response.json();

  await setUser(user.wallet, user.email, true);

  return userNotification;
};

// - POSITIONS
export const getUserPositions = async (
  user: types.User,
  timeframe: types.UserPositionTimeframe,
  skipCache: boolean = false
): Promise<types.UserPosition[]> => {
  const cacheKey = `getUserPositions-${user.wallet}-${timeframe}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL && !skipCache) {
    console.log("Cache hit for getUserPositions");
    return cached.data;
  }

  const url = `${BASE_URL}/positions/get/${user.wallet}/${timeframe}`;
  const response = await fetch(url);
  const userPositions = await response.json();
  apiCache.set(cacheKey, {
    data: userPositions,
    timestamp: Date.now(),
  });
  return userPositions;
};

export const setUserPosition = async (
  user: types.User
): Promise<types.UserPosition> => {
  const url = `${BASE_URL}/positions/set/${user.wallet}`;

  const response = await fetch(url);
  const userPosition = await response.json();
  console.log("setUserPosition", userPosition);
  return userPosition;
};

// - ACTIONS
export const getUserActions = async (
  user: types.User,
  skipCache: boolean = false
): Promise<types.UserAction[]> => {
  const cacheKey = `getUserActions-${user.id}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL && !skipCache) {
    console.log("Cache hit for getUserActions");
    return cached.data;
  }

  const url = `${BASE_URL}/actions/get/${user.wallet}`;

  const response = await fetch(url);
  const userActions = await response.json();
  console.log("getUserActions", userActions);
  apiCache.set(cacheKey, {
    data: userActions,
    timestamp: Date.now(),
  });
  return userActions;
};

export const setUserAction = async (
  wallet: string,
  action: types.Action,
  amount: number
): Promise<types.UserAction> => {
  const url = `${BASE_URL}/actions/set/${wallet}/${action}/${amount}`;

  const response = await fetch(url);
  const userAction = await response.json();

  return userAction;
};

// - RESET
export const resetUserCache = () => {
  apiCache.clear();
  console.log("User API cache cleared");
};
