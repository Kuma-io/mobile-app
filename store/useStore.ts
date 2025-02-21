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
  yield: number;
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
    yield: number;
    positionData: ChartData[];
    timeframe: Timeframe;
  };
  // Actions
  updateWalletAddress: (walletAddress: string) => void;
  updateBalance: (balance: number) => void;
  updateTimeframe: (timeframe: Timeframe) => void;
  fetchPositionData: () => Promise<void>;

  // Settings
  settings: {
    currencySlug: CurrencySlug;
  };
  updateSettings: (settings: Partial<StoreState["settings"]>) => void;
}

const DEFAULT_SETTINGS = {
  currencySlug: "USD" as CurrencySlug,
  timeframe: "H" as Timeframe,
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Data
      data: {
        walletAddress: null,
        balance: 0,
        principal: 0,
        yield: 0,
        positionData: [],
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
          const apiUrl = `https://kuma-server.vercel.app/positions/${walletAddress}/${timeframe}/2`;
          console.log("Fetching from:", apiUrl);
          const response = await fetch(apiUrl);
          const json: ApiResponse = await response.json();
          console.log("Response:", json);

          const chartData = json.data
            .map((item) => ({
              timestamp: item.blockNumber * 12000,
              balance: Number(parseFloat(item.userBalance).toFixed(6)),
              principal: Number(parseFloat(item.userPrincipal).toFixed(6)),
              yield:
                Number(parseFloat(item.userBalance).toFixed(6)) -
                Number(parseFloat(item.userPrincipal).toFixed(6)),
            }))
            .reverse();

          set((state) => ({
            data: {
              ...state.data,
              positionData: chartData,
              balance: chartData[chartData.length - 1]?.balance || 0,
              principal: chartData[chartData.length - 1]?.principal || 0,
              yield:
                chartData[chartData.length - 1]?.balance -
                  chartData[chartData.length - 1]?.principal || 0,
            },
          }));
        } catch (error) {
          console.error("Fetch error:", error);
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
