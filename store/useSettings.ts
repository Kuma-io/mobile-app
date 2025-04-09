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
import useUser from "./useUser";
interface SettingsState {
  currencySlug: types.CurrencySlug;
  currencyRate: number;
  notification: boolean;
  timeframe: types.UserPositionTimeframe;

  // Methods
  updateCurrencySlug: (currencySlug: types.CurrencySlug) => void;
  updateNotification: (notification: boolean) => Promise<void>;
  fetchCurrencyRate: () => Promise<void>;
  fetchNotification: () => Promise<void>;
  updateTimeframe: (timeframe: types.UserPositionTimeframe) => void;
  reset: () => void;
}

const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      currencySlug: "USD" as types.CurrencySlug,
      currencyRate: 1,
      notification: true,
      timeframe: "1H" as types.UserPositionTimeframe,

      // Methods
      updateNotification: async (notification: boolean) => {
        const { walletAddress } = useUser.getState();
        if (!walletAddress) {
          console.error("No wallet address available");
          return;
        }
        try {
          await registerUserNotification(walletAddress, notification);

          triggerHaptic("success");
          set((state) => ({
            notification,
          }));
        } catch (error) {
          console.error("Error updating notification", error);
        }
      },
      updateCurrencySlug: (currencySlug: types.CurrencySlug) => {
        toast.success("Currency updated to " + currencySlug);
        triggerHaptic("success");
        set((state) => ({
          currencySlug,
        }));
        get().fetchCurrencyRate();
      },
      fetchNotification: async () => {
        const { walletAddress } = useUser.getState();
        if (!walletAddress) {
          console.error("No wallet address available");
          return;
        }
        const json = await getUserNotifications(walletAddress);
        set((state) => ({
          notification: json,
        }));
      },
      fetchCurrencyRate: async () => {
        const { currencySlug } = get();
        const json = await getCurrencyRate(currencySlug);
        set((state) => ({
          currencyRate: json,
        }));
      },
      updateTimeframe: (timeframe: types.UserPositionTimeframe) =>
        set((state) => ({
          ...state,
          timeframe,
        })),
      reset: () =>
        set((state) => ({
          ...state,
          currencySlug: "USD" as types.CurrencySlug,
          currencyRate: 1,
          notification: true,
          timeframe: "1H" as types.UserPositionTimeframe,
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currencySlug: state.currencySlug,
        currencyRate: state.currencyRate,
        notification: state.notification,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);

export default useSettings;
