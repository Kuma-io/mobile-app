import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApy, getApyHistory } from "@/lib/api/aave";
import * as types from "@/types";

interface AaveState {
  apy: number;
  aus: number;
  apyVariation: number;
  apyTimeframe: number;
  apyTimeframeHistory: number[];
  timeframe: types.ApyTimeframe;

  // Methods
  getApy: () => Promise<void>;
  getApyHistory: () => Promise<void>;
  setTimeframe: (timeframe: types.ApyTimeframe) => void;
  reset: () => void;
}

const useAave = create<AaveState>()(
  persist(
    (set, get) => ({
      apy: 0,
      aus: 0,
      apyVariation: 0,
      apyTimeframe: 0,
      apyTimeframeHistory: [],
      timeframe: "1W" as types.ApyTimeframe,

      // Methods
      getApy: async () => {
        const result = await getApy();
        set((state) => ({
          ...state,
          apy: result.apy,
          aus: result.aus,
          apyVariation: result.apyVariation,
        }));
      },
      getApyHistory: async () => {
        const { timeframe } = get();
        const result = await getApyHistory(timeframe as types.ApyTimeframe);
        set((state) => ({
          ...state,
          apyTimeframe: result.apy,
          apyTimeframeHistory: result.apyHistory,
        }));
      },
      setTimeframe: (timeframe: types.ApyTimeframe) =>
        set((state) => ({
          ...state,
          timeframe,
        })),
      reset: () =>
        set((state) => ({
          ...state,
          apy: 0,
          aus: 0,
          apyVariation: 0,
          apyTimeframe: 0,
          apyTimeframeHistory: [],
          timeframe: "1W" as types.ApyTimeframe,
        })),
    }),
    {
      name: "protocol-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        apy: state.apy,
        aus: state.aus,
        apyVariation: state.apyVariation,
        apyTimeframe: state.apyTimeframe,
        apyTimeframeHistory: state.apyTimeframeHistory,
        timeframe: state.timeframe,
      }),
    }
  )
);

export default useAave;
