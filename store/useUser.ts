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
import useSettings from "./useSettings";
interface UserState {
  email: string | null;
  walletAddress: string | null;
  balance: number;
  principal: number;
  yield: number;
  data: {
    positions: types.ChartData[];
    actions: types.Action[];
  };

  // Methods
  updateEmail: (email: string) => void;
  updateWalletAddress: (walletAddress: string) => void;
  updateBalance: (balance: number) => void;
  fetchPositionData: () => Promise<void>;
  fetchActions: () => Promise<void>;
  reset: () => void;
}

const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      email: null,
      walletAddress: null,
      balance: 0,
      principal: 0,
      yield: 0,
      // Data
      data: {
        positions: [],
        actions: [],
      },

      // Methods
      updateEmail: (email: string) =>
        set((state) => ({
          ...state,
          email,
        })),
      updateWalletAddress: (walletAddress: string) =>
        set((state) => ({
          ...state,
          walletAddress,
        })),
      updateBalance: (balance: number) =>
        set((state) => ({
          ...state,
          balance,
        })),
      fetchPositionData: async () => {
        const { walletAddress } = get();
        const { timeframe } = useSettings.getState();

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
            ...state,
            balance,
            principal,
            yield: balance - principal,
            data: {
              positions: positionData,
              actions: state.data.actions,
            },
          }));
        } catch (error) {
          console.error("Fetch error:", error);
        }
      },
      fetchActions: async () => {
        const { walletAddress } = get();

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
            ...state,
            data: {
              positions: state.data.positions,
              actions,
            },
          }));
        } catch (error) {
          console.error("Error fetching actions:", error);
        }
      },
      reset: () =>
        set((state) => ({
          ...state,
          email: null,
          walletAddress: null,
          balance: 0,
          principal: 0,
          yield: 0,
          data: {
            positions: [],
            actions: [],
          },
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        email: state.email,
        walletAddress: state.walletAddress,
        balance: state.balance,
        principal: state.principal,
        yield: state.yield,
        data: state.data,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);

export default useUser;
