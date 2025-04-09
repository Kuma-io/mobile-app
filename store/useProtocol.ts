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

interface ProtocolState {
  apy: number;
  apyVariation: number;
  apyAvg: number;
  apyHistory: number[];
  totalSupply: number;
  timeframe: types.ApyTimeframe;

  // Methods
  fetchApy: () => Promise<void>;
  fetchApyHistory: () => Promise<void>;
  updateTimeframe: (timeframe: types.ApyTimeframe) => void;
  reset: () => void;
}

const useProtocol = create<ProtocolState>()(
  persist(
    (set, get) => ({
      apy: 0,
      apyVariation: 0,
      apyAvg: 0,
      apyHistory: [],
      totalSupply: 0,
      timeframe: "1W" as types.ApyTimeframe,

      // Methods
      fetchApy: async () => {
        const json = await getApy();
        set((state) => ({
          ...state,
          apy: json.apy,
          apyVariation: json.apyVariation,
          totalSupply: json.totalSupply,
        }));
      },
      fetchApyHistory: async () => {
        const { timeframe } = get();
        const json = await getApyHistory(timeframe as types.ApyTimeframe);
        set((state) => ({
          ...state,
          apyAvg: json.avgRate,
          apyHistory: json.rateHistory,
        }));
      },
      updateTimeframe: (timeframe: types.ApyTimeframe) =>
        set((state) => ({
          ...state,
          timeframe,
        })),
      reset: () =>
        set((state) => ({
          ...state,
          apy: 0,
          apyVariation: 0,
          apyAvg: 0,
          apyHistory: [],
          totalSupply: 0,
          timeframe: "1W" as types.ApyTimeframe,
        })),
    }),
    {
      name: "protocol-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        apy: state.apy,
        apyVariation: state.apyVariation,
        totalSupply: state.totalSupply,
        timeframe: state.timeframe,
        avgApy: state.apyAvg,
        apyHistory: state.apyHistory,
      }),
    }
  )
);

export default useProtocol;
