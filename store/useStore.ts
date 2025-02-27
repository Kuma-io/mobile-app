import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserActions,
  getUserPositions,
  getApy,
  getApyHistory,
  registerUserNotification,
  getUserNotifications,
  getCurrencyRate,
} from "@/lib/api";
import * as types from "@/types";
import { toast } from "sonner-native";
import { triggerHaptic } from "@/utils/haptics";
interface StoreState {
  data: {
    walletAddress: string | null;
    balance: number;
    principal: number;
    yieldValue: number;
    positionData: types.ChartData[];
    actions: types.Action[];
    timeframe: types.UserPositionTimeframe;
  };
  // Actions
  updateWalletAddress: (walletAddress: string) => void;
  updateBalance: (balance: number) => void;
  updateTimeframe: (timeframe: types.UserPositionTimeframe) => void;
  fetchPositionData: () => Promise<void>;
  fetchActions: () => Promise<void>;
  reset: () => void;

  stats: {
    apy: number;
    apyVariation: number;
    totalSupply: number;
    timeframe: types.ApyTimeframe;
    avgApy: number;
    apyHistory: number[];
  };
  fetchApy: () => Promise<void>;
  fetchApyHistory: () => Promise<void>;
  updateApyTimeframe: (timeframe: types.ApyTimeframe) => void;
  // Settings
  settings: {
    currencySlug: types.CurrencySlug;
    currencyRate: number;
    notification: boolean;
  };
  updateNotification: (notification: boolean) => void;
  fetchNotification: () => Promise<void>;
  updateCurrencySlug: (currencySlug: types.CurrencySlug) => void;
  fetchCurrencyRate: () => Promise<void>;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Data
      data: {
        walletAddress: null,
        balance: 0,
        principal: 0,
        yieldValue: 0,
        positionData: [],
        actions: [],
        timeframe: "1H" as types.UserPositionTimeframe,
      },
      updateWalletAddress: (walletAddress: string) =>
        set((state) => ({
          data: {
            ...state.data,
            walletAddress,
          },
        })),
      updateBalance: (balance: number) =>
        set((state) => ({
          data: {
            ...state.data,
            balance,
          },
        })),
      updateTimeframe: (timeframe: types.UserPositionTimeframe) =>
        set((state) => ({
          data: {
            ...state.data,
            timeframe,
          },
        })),
      fetchPositionData: async () => {
        const { walletAddress, timeframe } = get().data;

        if (!walletAddress) {
          console.error("No wallet address available");
          return;
        }

        try {
          const json = await getUserPositions(walletAddress, timeframe);
          if (!json.userPositions || json.userPositions.length === 0) {
            console.log("No position data available");
            return;
          }

          // Transform API data into ChartData format
          const positionData: types.ChartData[] = json.userPositions
            .map((position: types.UserPosition) => ({
              timestamp: new Date(position.timestamp).getTime(),
              value: parseFloat(position.userBalance),
            }))
            .sort(
              (a: types.ChartData, b: types.ChartData) =>
                a.timestamp - b.timestamp
            );
          // Get the latest position data
          const latestData = json.userPositions[0];
          const principal = parseFloat(latestData.userPrincipal);
          const balance = parseFloat(latestData.userBalance);

          set((state) => ({
            data: {
              ...state.data,
              balance,
              principal,
              yieldValue: balance - principal,
              positionData,
            },
          }));
        } catch (error) {
          console.error("Fetch error:", error);
        }
      },
      fetchActions: async () => {
        const { walletAddress } = get().data;

        if (!walletAddress) {
          console.error("No wallet address available");
          return;
        }

        try {
          const json = await getUserActions(walletAddress);
          if (!json.userActions || json.userActions.length === 0) {
            console.log("No actions available");
            return;
          }

          const actions: types.Action[] = json.userActions.map(
            (action: any) => ({
              timestamp: action.timestamp,
              action: action.action,
              amount: action.amount,
            })
          );

          set((state) => ({
            data: {
              ...state.data,
              actions,
            },
          }));
        } catch (error) {
          console.error("Error fetching actions:", error);
        }
      },

      // Stats
      stats: {
        apy: 0,
        apyVariation: 0,
        totalSupply: 0,
        timeframe: "1W" as types.ApyTimeframe,
        avgApy: 0,
        apyHistory: [],
      },
      fetchApy: async () => {
        const json = await getApy();
        set((state) => ({
          stats: {
            ...state.stats,
            apy: json.apy,
            apyVariation: json.apyVariation,
            totalSupply: json.totalSupply,
          },
        }));
      },
      fetchApyHistory: async () => {
        const { timeframe } = get().stats;
        const json = await getApyHistory(timeframe as types.ApyTimeframe);
        set((state) => ({
          stats: {
            ...state.stats,
            avgApy: json.avgRate,
            apyHistory: json.rateHistory,
          },
        }));
      },
      updateApyTimeframe: (timeframe: types.ApyTimeframe) =>
        set((state) => ({
          stats: {
            ...state.stats,
            timeframe,
          },
        })),
      // Settings
      settings: {
        currencySlug: "USD" as types.CurrencySlug,
        currencyRate: 1,
        notification: true,
      },
      updateNotification: async (notification: boolean) => {
        const { walletAddress } = get().data;
        if (!walletAddress) {
          console.error("No wallet address available");
          return;
        }
        try {
          await registerUserNotification(walletAddress, notification);
          toast.success("Notification turned " + (notification ? "on" : "off"));
          triggerHaptic("success");
          set((state) => ({
            settings: {
              ...state.settings,
              notification,
            },
          }));
        } catch (error) {
          toast.error("Error updating notification");
        }
      },
      fetchNotification: async () => {
        const { walletAddress } = get().data;
        if (!walletAddress) {
          console.error("No wallet address available");
          return;
        }
        const json = await getUserNotifications(walletAddress);
        set((state) => ({
          settings: {
            ...state.settings,
            notification: json,
          },
        }));
      },
      updateCurrencySlug: (currencySlug: types.CurrencySlug) => {
        toast.success("Currency updated to " + currencySlug);
        triggerHaptic("success");
        set((state) => ({
          settings: {
            ...state.settings,
            currencySlug,
          },
        }));
        get().fetchCurrencyRate();
      },
      fetchCurrencyRate: async () => {
        const { currencySlug } = get().settings;
        const json = await getCurrencyRate(currencySlug);
        set((state) => ({
          settings: {
            ...state.settings,
            currencyRate: json,
          },
        }));
      },
      reset: () =>
        set((state) => ({
          data: {
            walletAddress: null,
            balance: 0,
            principal: 0,
            yieldValue: 0,
            positionData: [],
            actions: [],
            timeframe: "1H" as types.UserPositionTimeframe,
          },
          stats: {
            apy: 0,
            apyVariation: 0,
            totalSupply: 0,
            timeframe: "1W" as types.ApyTimeframe,
            avgApy: 0,
            apyHistory: [],
          },
          settings: {
            currencySlug: "USD" as types.CurrencySlug,
            currencyRate: 1,
            notification: true,
          },
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        data: state.data,
        stats: state.stats,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);

export default useStore;
