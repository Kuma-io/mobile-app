import { router, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react-native";

import { Transactions } from "@/pages/transactions";

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
      <Text className="font-sans-extrabold text-3xl">Transactions</Text>
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
