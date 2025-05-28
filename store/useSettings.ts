import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrencyRate } from "@/lib/api/currency";
import * as types from "@/types";
import { toast } from "sonner-native";
import { triggerHaptic } from "@/utils/haptics";

interface SettingsState {
  timeframe: types.UserPositionTimeframe;
  currencySlug: types.CurrencySlug;
  currencyRate: number;

  // -- METHODS --
  setTimeframe: (timeframe: types.UserPositionTimeframe) => void;
  getCurrency: (
    currencySlug: types.CurrencySlug,
    triggerToast: boolean
  ) => Promise<void>;
  reset: () => void;
}

const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      timeframe: "1H" as types.UserPositionTimeframe,
      currencySlug: "USD" as types.CurrencySlug,
      currencyRate: 1,

      // -- METHODS --
      setTimeframe: (timeframe: types.UserPositionTimeframe) =>
        set((state) => ({
          ...state,
          timeframe,
        })),

      getCurrency: async (
        currencySlug: types.CurrencySlug,
        triggerToast: boolean = true
      ) => {
        if (triggerToast) {
          toast.success("Currency updated to " + currencySlug);
          triggerHaptic("success");
        }
        const rate = await getCurrencyRate(currencySlug);
        set((state) => ({
          ...state,
          currencyRate: rate,
        }));
      },

      reset: () =>
        set((state) => ({
          ...state,
          timeframe: "1H" as types.UserPositionTimeframe,
          currencySlug: "USD" as types.CurrencySlug,
          currencyRate: 1,
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currencySlug: state.currencySlug,
        currencyRate: state.currencyRate,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);

export default useSettings;
