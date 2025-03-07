import React from "react";
import { View, Text, Pressable } from "react-native";
import useStore from "@/store/useStore";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  CircleDollarSign,
} from "lucide-react-native";
import { router } from "expo-router";
import { CurrencySign } from "@/types/currency";
import { triggerHaptic } from "@/utils/haptics";
import { getRelativeTimeGroup } from "@/utils/getRelativeTimeGroup";

export default function Activity() {
  const {
    data: { actions },
    settings: { currencySlug, currencyRate },
  } = useStore();

  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <View
      className="w-full flex-col items-start justify-start gap-2 px-8"
      style={{ height: 300 }}
    >
      <View className="flex-row items-center justify-between w-full">
        <Text className="font-sans-bold text-lg text-gray-400">
          Transactions
        </Text>
        <Pressable
          onPress={() => {
            router.push("/transactions");
            triggerHaptic("light");
          }}
        >
          <Text className="font-sans-black text-sm">Display All</Text>
        </Pressable>
      </View>

      {sortedActions.length === 0 ? (
        <View className="w-full h-16 flex-row items-center justify-center">
          <Text className="font-sans-medium text-sm">No transactions yet</Text>
        </View>
      ) : (
        <View className="w-full border-2 border-black rounded-2xl">
          {sortedActions.slice(0, 3).map((item, index) => (
            <View
              key={index}
              className={`w-full h-16 flex-row items-center justify-between my-auto px-4 ${
                index !== sortedActions.slice(0, 3).length - 1
                  ? "border-b-2 border-black"
                  : ""
              }`}
            >
              <View className="flex-row items-center justify-center gap-2">
                <View className="w-9 h-9 bg-black rounded-full flex-row items-center justify-center">
                  {item.action.toLowerCase() === "deposit" ? (
                    <ArrowDownToLine size={20} color="white" strokeWidth={3} />
                  ) : item.action.toLowerCase() === "rewards" ? (
                    <CircleDollarSign size={20} color="white" />
                  ) : (
                    <ArrowUpToLine size={20} color="white" strokeWidth={3} />
                  )}
                </View>
                <View className="flex-col items-start justify-center">
                  <Text className="font-sans-bold text-lg">
                    {item.action[0].toUpperCase() +
                      item.action.slice(1).toLowerCase()}
                  </Text>
                  <Text className="font-sans-medium text-xs text-gray-400">
                    {getRelativeTimeGroup(new Date(item.timestamp))} at{" "}
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
              <Text className="font-sans-bold text-xl">
                {item.action.toLowerCase() === "withdraw" ? "-" : ""}
                {`${(Number(item.amount) * currencyRate).toFixed(
                  item.action.toLowerCase() === "rewards" ? 6 : 2
                )}${
                  CurrencySign.find(
                    (currency) => currency.slug === currencySlug
                  )?.sign
                }`}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
