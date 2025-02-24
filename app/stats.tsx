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
import Overview from "@/pages/stats/1 - Overview";
import Chart from "@/pages/stats/2 - Chart";

export default function StatsPage() {
  const { stats } = useStore();
  return (
    <>
      <Stack.Screen options={{ title: "Stats", headerShown: false }} />

      <SafeAreaView className="flex-1 bg-white">
        <Header />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Overview />
          <View className="w-full py-1" />
          <Chart />
        </ScrollView>
        <Actions />
      </SafeAreaView>
    </>
  );
}

const Header = () => {
  return (
    <View className="flex w-full flex-row items-center justify-between p-4">
      <Text className="font-sans-extrabold text-3xl">Statistics</Text>
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
