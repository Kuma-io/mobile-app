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
export type Timeframe = "H" | "D" | "W" | "M";

interface StoreState {
  data: {
    walletAddress: string | null;
    balance: number;
    principal: number;
    yieldValue: number;
    positionData: ChartData[];
    timeframe: Timeframe;
  };
  // Actions
  updateWalletAddress: (walletAddress: string) => void;
  updateBalance: (balance: number) => void;
  updatePrincipal: (principal: number) => void;
  updateYieldValue: (yieldValue: number) => void;
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
        yieldValue: 0,
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
          const apiUrl = `https://kuma-server.vercel.app/positions/${walletAddress}/${timeframe}`;
          console.log("Fetching from:", apiUrl);
          const response = await fetch(apiUrl);
          const json: ApiResponse = await response.json();

          const chartData = json.data
            .map((item) => ({
              timestamp: new Date(item.blockNumber * 12000).getTime(),
              value: parseFloat(item.userBalance),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          console.log("Chart data:", chartData);

          const latestData = json.data[0];
          const principal = parseFloat(latestData.userPrincipal);
          const balance = chartData[chartData.length - 1]?.value || 0;

          set((state) => ({
            data: {
              ...state.data,
              positionData: chartData,
              balance,
              principal,
              yieldValue: balance - principal,
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
