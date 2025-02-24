import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserActions,
  getUserPositions,
  getApy,
  getApyHistory,
} from "@/lib/api";

interface UserPosition {
  timestamp: string;
  userBalance: string;
  userPrincipal: string;
}

interface Action {
  timestamp: string;
  action: string;
  amount: string;
}

interface ChartData {
  timestamp: number;
  value: number;
}

export type CurrencySlug =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CHF"
  | "AUD"
  | "CAD"
  | "NZD";
export type Timeframe = "H" | "D" | "W" | "M" | "Y";

interface StoreState {
  data: {
    walletAddress: string | null;
    balance: number;
    principal: number;
    yieldValue: number;
    positionData: ChartData[];
    actions: Action[];
    timeframe: Timeframe;
  };
  // Actions
  updateWalletAddress: (walletAddress: string) => void;
  updateBalance: (balance: number) => void;
  updatePrincipal: (principal: number) => void;
  updateYieldValue: (yieldValue: number) => void;
  updateTimeframe: (timeframe: Timeframe) => void;
  fetchPositionData: () => Promise<void>;
  fetchActions: () => Promise<void>;

  stats: {
    apy: number;
    apyVariation: number;
    totalSupply: number;
    timeframe: "W" | "M" | "6M" | "Y";
    avgApy: number;
    apyHistory: number[];
  };
  fetchApy: () => Promise<void>;
  fetchApyHistory: () => Promise<void>;
  updateApyTimeframe: (timeframe: "W" | "M" | "6M" | "Y") => void;
  // Settings
  settings: {
    currencySlug: CurrencySlug;
  };
  updateSettings: (settings: Partial<StoreState["settings"]>) => void;
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
        timeframe: "H" as Timeframe,
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
      updatePrincipal: (principal: number) =>
        set((state) => ({
          data: {
            ...state.data,
            principal,
          },
        })),
      updateYieldValue: (yieldValue: number) =>
        set((state) => ({
          data: {
            ...state.data,
            yieldValue,
          },
        })),
      updateTimeframe: (timeframe: Timeframe) =>
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
          const positionData: ChartData[] = json.userPositions
            .map((position: UserPosition) => ({
              timestamp: new Date(position.timestamp).getTime(),
              value: parseFloat(position.userBalance),
            }))
            .sort((a: ChartData, b: ChartData) => a.timestamp - b.timestamp);
          // Get the latest position data
          console.log("positionData", positionData);
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

          const actions: Action[] = json.userActions.map((action: any) => ({
            timestamp: action.timestamp,
            action: action.action,
            amount: action.amount,
          }));

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
        timeframe: "W" as "W" | "M" | "6M" | "Y",
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
        console.log("apy history timeframe", timeframe);
        const json = await getApyHistory(timeframe);
        set((state) => ({
          stats: {
            ...state.stats,
            avgApy: json.avgRate,
            apyHistory: json.rateHistory,
          },
        }));
      },
      updateApyTimeframe: (timeframe: "W" | "M" | "6M" | "Y") =>
        set((state) => ({
          stats: {
            ...state.stats,
            timeframe,
          },
        })),
      // Settings
      settings: {
        currencySlug: "USD" as CurrencySlug,
      },
      updateSettings: (newSettings) =>
        set((state) => {
          const updatedSettings = {
            ...state.settings,
            ...newSettings,
          };
          console.log("Updated settings:", updatedSettings);
          return { settings: updatedSettings };
        }),
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
