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
import MoonpayLoading from "./moonpay-loading";
import { useMoonPaySdk } from "@moonpay/react-native-moonpay-sdk";
import * as WebBrowser from "expo-web-browser";

export default function DepositDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [number, setNumber] = useState<number>(0);
  const [depositInitiated, setDepositInitiated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { settings, data } = useStore();
  useEffect(() => {
    if (!isVisible) {
      setDepositInitiated(false);
      setNumber(0);
    }
  }, [isVisible]);

  return (
    <Drawer isVisible={isVisible} onClose={onClose} isBlack>
      <Header />
      {depositInitiated ? (
        <MoonpayLoading
          amount={number}
          onOpen={() => setDepositInitiated(false)}
        />
      ) : (
        <>
          <NumScreen number={number} />
          <NumPad setNumber={setNumber} allowDecimals maxValue={999999.99} />
          <Actions
            isLoading={isLoading}
            onDeposit={() => {
              setDepositInitiated(true);
            }}
          />
        </>
      )}
    </Drawer>
  );
}

const Header = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-sans-extrabold pl-2 text-3xl text-white/80">
        Deposit
      </Text>
    </View>
  );
};

const Actions = ({
  isLoading,
  onDeposit,
}: {
  isLoading: boolean;
  onDeposit: () => void;
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
