import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserActions,
  getUserPositions,
  setUser,
  setUserNotification,
} from "@/lib/api/user";
import * as types from "@/types";
import useSettings from "./useSettings";

interface UserState {
  user: types.User | null;

  positions: types.ChartPosition[];
  actions: types.UserAction[];

  balance: number;
  principal: number;
  yield: number;

  // -- METHODS --
  setUser: (wallet: string, email: string) => Promise<void>;
  setNotification: (notification: boolean) => Promise<void>;
  getPositions: () => Promise<void>;
  getActions: () => Promise<void>;
  reset: () => void;
}

const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      positions: [],
      actions: [],
      balance: 0,
      principal: 0,
      yield: 0,

      // -- METHODS --
      // - USERS
      setUser: async (wallet: string, email: string) => {
        try {
          const user = await setUser(wallet, email);

          set((state) => ({
            ...state,
            user,
          }));

          console.log("USER OBJECT", user.wallet, user.email);

          const { getPositions, getActions } = get();
          await Promise.all([getPositions(), getActions()]);
        } catch (error) {
          console.error("setUser error:", error);
        }
      },

      // - NOTIFICATIONS
      setNotification: async (notification: boolean) => {
        try {
          const { user } = get();
          if (!user) throw new Error("No user available");
          await setUserNotification(user, notification);
        } catch (error) {
          console.error("setNotification error:", error);
        }
      },

      // - POSITIONS
      getPositions: async () => {
        try {
          const { user } = get();
          const { timeframe } = useSettings.getState();

          if (!user) throw new Error("No user available");

          const userPositions = await getUserPositions(user, timeframe);
          if (!userPositions || userPositions.length === 0)
            throw new Error("No position data available");

          // Transform API data into ChartData format
          const positions: types.ChartPosition[] = userPositions
            .map((position: types.UserPosition) => ({
              timestamp: new Date(position.timestamp).getTime(),
              value: parseFloat(position.userBalance),
            }))
            .sort(
              (a: types.ChartPosition, b: types.ChartPosition) =>
                a.timestamp - b.timestamp
            );

          const latestData = userPositions[0];
          const principal = parseFloat(latestData.userPrincipal);
          const balance = parseFloat(latestData.userBalance);

          set((state) => ({
            ...state,
            positions,
            balance,
            principal,
            yield: balance - principal,
          }));
        } catch (error) {
          console.error("getPositions error:", error);
        }
      },

      // - ACTIONS
      getActions: async () => {
        try {
          const { user } = get();
          if (!user) throw new Error("No user available");

          const actions = await getUserActions(user);
          if (!actions || actions.length === 0) {
            console.log("No actions available");
            return;
          }

          set((state) => ({
            ...state,
            actions,
          }));
        } catch (error) {
          console.error("getActions error:", error);
        }
      },
      reset: () =>
        set((state) => ({
          ...state,
          balance: 0,
          principal: 0,
          yield: 0,
          positions: [],
          actions: [],
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        positions: state.positions,
        actions: state.actions,
        balance: state.balance,
        principal: state.principal,
        yield: state.yield,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated state:", state);
      },
    }
  )
);

export default useUser;
