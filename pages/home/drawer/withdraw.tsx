import { router } from "expo-router";
import { ChevronRight, ScanLine } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import { NumPad } from "@/components/ui/numpad";
import { NumScreen } from "@/components/ui/numscreen";
export default function WithdrawDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [number, setNumber] = useState<number>(0);
  return (
    <Drawer isVisible={isVisible} onClose={onClose} isBlack>
      <Header />
      <NumScreen number={number} />
      <NumPad setNumber={setNumber} allowDecimals maxValue={999999.99} />
      <Actions />
    </Drawer>
  );
}

const Header = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-sans-extrabold pl-2 text-3xl text-white/80">
        Withdraw
      </Text>
      <Button
        onPress={() => {
          // router.push('/settings');
        }}
        noShadow
        className="flex-row items-center justify-around bg-white/90 p-2"
      >
        <ScanLine size={20} color="black" strokeWidth={2.5} />
      </Button>
    </View>
  );
};

const Actions = () => {
  return (
    <View className="w-full flex-row items-center justify-end py-4">
      <Button
        onPress={() => {
          // router.push("/login");
        }}
        isWhite
        className="h-14 w-[35vw] flex-row items-center justify-around pl-1"
      >
        <Text className="font-sans-extrabold text-lg">Withdraw</Text>
        <ChevronRight size={24} color="black" />
      </Button>
    </View>
  );
};
