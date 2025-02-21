import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PositionData {
  blockNumber: number;
  userBalance: string;
  userPrincipal: string;
}

interface ApiResponse {
  status: string;
  data: PositionData[];
}

interface ChartData {
  timestamp: number;
  balance: number;
  principal: number;
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
export type Timeframe = "H" | "D" | "W" | "M";

interface StoreState {
  data: {
    walletAddress: string | null;
    balance: number;
    principal: number;
    positionData: ChartData[];
    timeframe: Timeframe;
  };
  // Actions
  updateWalletAddress: (walletAddress: string) => void;
  updateBalance: (balance: number) => void;
  updatePrincipal: (principal: number) => void;
  fetchPositionData: () => Promise<void>;
  fetchingLoading: boolean;
  error: string | null;

  // Settings
  settings: {
    currencySlug: CurrencySlug;
    timeframe: Timeframe;
  };
  updateSettings: (settings: Partial<StoreState["settings"]>) => void;
}

const DEFAULT_SETTINGS = {
  currencySlug: "USD" as CurrencySlug,
  timeframe: "D" as Timeframe,
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Data
      data: {
        walletAddress: null,
        balance: 0,
        principal: 0,
        positionData: [],
        timeframe: "D" as Timeframe,
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
      fetchingLoading: false,
      error: null,
      fetchPositionData: async () => {
        const { walletAddress } = get().data;
        const { timeframe } = get().settings;

        if (!walletAddress) {
          console.error("No wallet address available");
          return;
        }

        set({ fetchingLoading: true, error: null });
        try {
          // Handle case where the history returns 0 because not created yet
          const apiUrl = `https://kuma-server.vercel.app/positions/${walletAddress}/${timeframe}`;
          console.log("Fetching from:", apiUrl);
          const response = await fetch(apiUrl);
          const json: ApiResponse = await response.json();
          console.log("Response:", json);

          const chartData = json.data
            .map((item) => ({
              timestamp: item.blockNumber * 12000,
              balance: Number(parseFloat(item.userBalance).toFixed(6)),
              principal: Number(parseFloat(item.userPrincipal).toFixed(6)),
            }))
            .reverse();

          set((state) => ({
            data: {
              ...state.data,
              positionData: chartData,
              balance: chartData[chartData.length - 1]?.balance || 0,
              principal: chartData[chartData.length - 1]?.principal || 0,
            },
            fetchingLoading: false,
          }));
        } catch (error) {
          console.error("Fetch error:", error);
          set({ error: (error as Error).message, fetchingLoading: false });
        }
      },

      // Settings
      settings: DEFAULT_SETTINGS,
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
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);

export default useStore;
