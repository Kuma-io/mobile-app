import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import DepositDrawer from "./drawer/deposit";
import WithdrawDrawer from "./drawer/withdraw";
import OnRampDrawer from "./drawer/on-ramp";

export default function ActionPage() {
  const insets = useSafeAreaInsets();
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isOnRampModalVisible, setIsOnRampModalVisible] = useState(false);
  return (
    <>
      <View
        style={{
          backgroundColor: "transparent",
          position: "absolute",
          bottom: insets.bottom,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
        className="w-full flex-row items-center justify-around px-4 pb-4"
      >
        <Button
          onPress={() => {
            setIsWithdrawModalVisible(true);
          }}
          className="flex-row items-center justify-around h-16 w-[40vw] pl-1"
        >
          <Text className="font-sans-extrabold text-lg text-white">
            Withdraw
          </Text>
          <ChevronRight size={24} color="white" />
        </Button>
        <Button
          onPress={() => {
            setIsDepositModalVisible(true);
          }}
          className="flex-row items-center justify-around h-16 w-[40vw] pl-2"
        >
          <Text className="font-sans-extrabold text-lg text-white">
            Deposit
          </Text>
          <ChevronRight size={24} color="white" />
        </Button>
        <Button
          onPress={() => {
            setIsOnRampModalVisible(true);
          }}
          className="flex-row items-center justify-around h-16 w-[40vw] pl-2"
        >
          <Text className="font-sans-extrabold text-lg text-white">
            On Ramp
          </Text>
          <ChevronRight size={24} color="white" />
        </Button>
      </View>
      <WithdrawDrawer
        isVisible={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
      />
      <DepositDrawer
        isVisible={isDepositModalVisible}
        onClose={() => setIsDepositModalVisible(false)}
      />
      <OnRampDrawer
        isVisible={isOnRampModalVisible}
        onClose={() => setIsOnRampModalVisible(false)}
      />
    </>
  );
}
