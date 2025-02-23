import { router, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ChevronLeft,
  CircleDollarSign,
} from "lucide-react-native";
import useStore from "@/store/useStore";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayNumber = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${day} ${dayNumber} ${month}`;
};

interface Action {
  timestamp: string;
  action: string;
  amount: string;
}

interface GroupedActions {
  [key: string]: Action[];
}

export default function TransactionsPage() {
  return (
    <>
      <Stack.Screen options={{ title: "Transactions", headerShown: false }} />

      <SafeAreaView className="flex-1 bg-white">
        <Header />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Transactions />
        </ScrollView>
        <Actions />
      </SafeAreaView>
    </>
  );
}

const Header = () => {
  return (
    <View className="flex w-full flex-row items-center justify-between p-4">
      <Text className="font-sans-extrabold text-2xl">Transactions</Text>
    </View>
  );
};

const Transactions = () => {
  const { actions } = useStore((state) => state.data);

  const groupedActions: GroupedActions = actions.reduce((groups, action) => {
    const date = new Date(action.timestamp);
    const dateKey = date.toISOString().split("T")[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(action);
    groups[dateKey].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return groups;
  }, {} as GroupedActions);

  const sortedDays = Object.keys(groupedActions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <View className="flex-1 w-full px-4 gap-4 mb-20">
      {sortedDays.map((day, dayIndex) => (
        <View
          key={day}
          className="w-full flex-col items-start justify-start gap-2"
        >
          <View className="flex-row items-center justify-between w-full">
            <Text className="font-sans-bold text-sm text-gray-400">
              {formatDate(day).toUpperCase()}
            </Text>
          </View>
          <View className="w-full border-2 border-black rounded-2xl">
            {groupedActions[day].map((item, index) => (
              <View
                key={item.timestamp}
                className={`w-full h-16 flex-row items-center justify-between my-auto px-4 ${
                  index !== groupedActions[day].length - 1
                    ? "border-b-2 border-black"
                    : ""
                }`}
              >
                <View className="flex-row items-center justify-center gap-2">
                  <View className="w-9 h-9 bg-black rounded-full flex-row items-center justify-center">
                    {item.action.toLowerCase() === "deposit" ? (
                      <ArrowDownToLine
                        size={20}
                        color="white"
                        strokeWidth={3}
                      />
                    ) : item.action.toLowerCase() === "rewards" ? (
                      <CircleDollarSign size={20} color="white" />
                    ) : (
                      <ArrowUpToLine size={20} color="white" strokeWidth={3} />
                    )}
                  </View>
                  <Text className="font-sans-bold text-lg">
                    {item.action.toUpperCase()}
                  </Text>
                </View>
                <Text className="font-sans-bold text-xl">
                  {item.action.toLowerCase() === "withdraw" ? "-" : ""}
                  {item.amount}$
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const Actions = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: "transparent",
        position: "absolute",
        bottom: insets.bottom,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
      className="flex w-full flex-row items-center justify-between gap-8 px-8 pb-4"
    >
      <Button
        onPress={() => {
          router.back();
        }}
        noShadow
        className="flex-row items-center justify-around aspect-square h-14"
      >
        <ChevronLeft size={24} color="white" />
      </Button>
    </View>
  );
};
