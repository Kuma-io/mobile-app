import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import useStore from "@/store/useStore";
import { Button } from "@/components/ui/button";

export default function Activity() {
  const { actions } = useStore((state) => state.data);

  useEffect(() => {
    console.log("actions", actions);
  }, [actions]);

  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const renderItem = ({
    item,
  }: {
    item: { timestamp: string; action: string; amount: string };
  }) => (
    <View className="w-full h-16 border-2 border-black rounded-2xl flex-row items-center justify-between my-auto px-4 mb-2">
      <View className="items-start justify-center">
        <Text className="font-sans-bold text-lg">{item.action}</Text>
        <Text className="font-sans-medium text-sm text-gray-400">
          {new Date(item.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            year: "numeric",
          })}
        </Text>
      </View>
      <Text className="font-sans-bold text-lg">{item.amount} USDC</Text>
    </View>
  );

  return (
    <View className="w-full flex-col items-start justify-between gap-2 px-8">
      <Text className="font-sans-bold text-lg text-gray-400">Activity</Text>
      <FlatList
        data={sortedActions}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
