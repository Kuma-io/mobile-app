import { router } from "expo-router";
import { CircleUserRound } from "lucide-react-native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import useUser from "@/store/useUser";
import useSettings from "@/store/useSettings";
import useAave from "@/store/useAave";
import { useEmbeddedWallet, usePrivy } from "@privy-io/expo";

export default function Header() {
  const { user } = usePrivy();
  const { setUser } = useUser();
  const { getCurrency, currencySlug } = useSettings();
  const { getApy } = useAave();
  const wallet = useEmbeddedWallet();

  useEffect(() => {
    const initializeWallet = async () => {
      const smartWallet = user?.linked_accounts.find(
        (account) => account.type === "smart_wallet"
      );
      const wallet = smartWallet?.address;
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
      console.log("Header", wallet, email);
      if (wallet && email) {
        await setUser(wallet, email);
        await Promise.all([getApy(), getCurrency(currencySlug, false)]);
      }
    };

    if (wallet.status === "not-created") wallet.create();
    else if (wallet.status === "connected") initializeWallet();
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
