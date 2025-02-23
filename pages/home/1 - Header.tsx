import { router } from "expo-router";
import { CircleUserRound } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";
import { useEmbeddedWallet, usePrivy } from "@privy-io/expo";

export default function Header() {
  const { user } = usePrivy();
  const {
    updateWalletAddress,
    fetchPositionData,
    data: { balance, principal, yieldValue, positionData },
  } = useStore();
  const wallet = useEmbeddedWallet();

  useEffect(() => {
    const initializeWallet = async () => {
      const smartWallet = user?.linked_accounts.find(
        (account) => account.type === "smart_wallet"
      );
      if (smartWallet) {
        const walletAddress = smartWallet.address;
        // updateWalletAddress("0x1f29312f134C79984bA4b21840f2C3DcF57b9c85");
        updateWalletAddress(walletAddress);
        console.log("smartWallet", walletAddress);
        await fetchPositionData();
      }
    };

    if (wallet.status === "not-created") {
      wallet.create();
    } else if (wallet.status === "connected") {
      initializeWallet();
    }
  }, [wallet.status]);

  return (
    <View className="flex w-full flex-row items-center justify-between p-4">
      <Text className="font-sans-extrabold text-3xl">Account</Text>
      <Button
        onPress={() => {
          router.push("/setting");
        }}
        noShadow
        className="flex-row items-center justify-around bg-black/90 p-2"
      >
        <CircleUserRound size={20} color="white" strokeWidth={2.5} />
      </Button>
    </View>
  );
}
