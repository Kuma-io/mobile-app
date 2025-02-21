import { router } from "expo-router";
import { CircleUserRound } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";
import {
  getUserEmbeddedWallet,
  useEmbeddedWallet,
  usePrivy,
} from "@privy-io/expo";

export default function Header() {
  const { logout, user } = usePrivy();
  const { updateWalletAddress, fetchPositionData } = useStore();
  const wallet = useEmbeddedWallet();
  const account = getUserEmbeddedWallet(user);

  useEffect(() => {
    // Initialize wallet
    const initializeWallet = async () => {
      if (account) {
        // In production, use: account.address
        const walletAddress = "0x1f29312f134C79984bA4b21840f2C3DcF57b9c85";
        updateWalletAddress(walletAddress);
        await fetchPositionData();
      }
    };

    // Create wallet if not created
    if (wallet.status === "not-created") {
      wallet.create();
    } else {
      initializeWallet();
    }
  }, [account, wallet.status]);

  return (
    <View className="flex w-full flex-row items-center justify-between p-4">
      <Text className="font-sans-extrabold text-3xl">Account</Text>
      <Button
        onPress={() => {
          logout();
        }}
        noShadow
        className="flex-row items-center justify-around bg-black/90 p-2"
      >
        <CircleUserRound size={20} color="white" strokeWidth={2.5} />
      </Button>
    </View>
  );
}
