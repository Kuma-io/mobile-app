import { router } from "expo-router";
import { ChevronRight, ScanLine } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { toast } from "sonner-native";

import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import { NumPad } from "@/components/ui/numpad";
import { NumScreen } from "@/components/ui/numscreen";
import { deposit } from "@/lib/deposit";
import { useSmartWallets } from "@privy-io/expo/smart-wallets";
import { triggerHaptic } from "@/utils/haptics";
import useStore from "@/store/useStore";

export default function DepositDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [number, setNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { client } = useSmartWallets();
  const { fetchPositionData } = useStore();
  const handleDeposit = async (): Promise<any> => {
    triggerHaptic("heavy");
    if (!client || number <= 0) return;

    return toast.promise(
      (async () => {
        try {
          setIsLoading(true);
          const receipt = await deposit(client, number);
          fetchPositionData();
          triggerHaptic("success");
          onClose();
          return receipt;
        } catch (error) {
          triggerHaptic("error");
          throw error;
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: "Depositing...",
        success: (receipt) => `Deposit successful!`,
        error: "Deposit failed",
      }
    );
  };

  return (
    <Drawer isVisible={isVisible} onClose={onClose} isBlack>
      <Header />
      <NumScreen number={number} />
      <NumPad setNumber={setNumber} allowDecimals maxValue={999999.99} />
      <Actions isLoading={isLoading} onDeposit={handleDeposit} />
    </Drawer>
  );
}

const Header = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-sans-extrabold pl-2 text-3xl text-white/80">
        Deposit
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

const Actions = ({
  isLoading,
  onDeposit,
}: {
  isLoading: boolean;
  onDeposit: () => Promise<void>;
}) => {
  return (
    <View className="w-full flex-row items-center justify-end py-4">
      <Button
        onPress={onDeposit}
        isWhite
        disabled={isLoading}
        className="h-14 w-[35vw] flex-row items-center justify-around pl-1"
      >
        <Text className="font-sans-extrabold text-lg">Deposit</Text>
        <ChevronRight size={24} color="black" />
      </Button>
    </View>
  );
};
