import { router } from "expo-router";
import { CircleUserRound } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import useStore from "@/store/useStore";
import { useEmbeddedWallet, usePrivy } from "@privy-io/expo";
import { registerUser } from "@/lib/api";

export default function Header() {
  const { user } = usePrivy();
  const {
    updateWalletAddress,
    fetchPositionData,
    fetchActions,
    fetchApy,
    fetchApyHistory,
    fetchNotification,
    fetchCurrencyRate,
  } = useStore();
  const wallet = useEmbeddedWallet();

  useEffect(() => {
    const initializeWallet = async () => {
      const smartWallet = user?.linked_accounts.find(
        (account) => account.type === "smart_wallet"
      );
      const walletAddress = smartWallet?.address;
      const emailAccount = user?.linked_accounts.find(
        (account) =>
          account.type === "google_oauth" ||
          account.type === "email" ||
          account.type === "apple_oauth"
      );
      const email =
        emailAccount?.type === "email"
          ? emailAccount.address
          : emailAccount?.email;
      console.log(walletAddress, emailAccount);
      if (walletAddress && email) {
        updateWalletAddress(walletAddress);
        await registerUser(walletAddress, email);
        await Promise.all([
          fetchPositionData(),
          fetchActions(),
          fetchApy(),
          fetchCurrencyRate(),
        ]);
        fetchApyHistory();
        fetchNotification();
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
