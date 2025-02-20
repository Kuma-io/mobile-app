import { router } from "expo-router";
import { CircleUserRound } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";

import { usePrivy } from "@privy-io/expo";

export default function Header() {
  const { logout } = usePrivy();
  return (
    <View className="flex w-full flex-row items-center justify-between p-4">
      <Text className="font-sans-extrabold text-3xl">Account</Text>
      <Button
        onPress={() => {
          logout();
          // router.push("/settings");
        }}
        noShadow
        className="flex-row items-center justify-around bg-black/90 p-2"
      >
        <CircleUserRound size={20} color="white" strokeWidth={2.5} />
      </Button>
    </View>
  );
}
