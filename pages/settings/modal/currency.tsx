import { router } from "expo-router";
import { Euro, DollarSign, PoundSterling, Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { toast } from "sonner-native";

import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import { NumPad } from "@/components/ui/numpad";
import { NumScreen } from "@/components/ui/numscreen";
import { withdraw } from "@/lib/withdraw";
import { useSmartWallets } from "@privy-io/expo/smart-wallets";
import { triggerHaptic } from "@/utils/haptics";
import useStore from "@/store/useStore";

export default function CurrencyModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [number, setNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { client } = useSmartWallets();
  const { fetchPositionData, fetchActions } = useStore();

  useEffect(() => {
    if (!isVisible) {
      setNumber(0);
    }
  }, [isVisible]);

  const handleWithdraw = async (): Promise<any> => {
    triggerHaptic("heavy");
    if (!client || number <= 0) return;

    return toast.promise(
      (async () => {
        try {
          setIsLoading(true);
          const receipt = await withdraw(client, number);
          fetchPositionData();
          fetchActions();
          triggerHaptic("success");
          onClose();
          return receipt;
        } catch (error) {
          triggerHaptic("error");
          console.log(error);
          throw error;
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: "Withdrawing...",
        success: (receipt) => `Withdrawal successful!`,
        error: "Withdrawal failed",
      }
    );
  };

  return (
    <Drawer
      isVisible={isVisible}
      onClose={onClose}
      isBlack
      style={{ height: "auto" }}
    >
      <Header />
      <SelectCurrency />
    </Drawer>
  );
}

const Header = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-sans-extrabold pl-2 text-2xl text-white/80">
        Currency
      </Text>
    </View>
  );
};

const CURRENCIES = [
  { slug: "USD", Icon: DollarSign },
  { slug: "EUR", Icon: Euro },
  { slug: "GBP", Icon: PoundSterling },
] as const;

const SelectCurrency = () => {
  const {
    updateCurrencySlug,
    settings: { currencySlug, currencyRate },
  } = useStore();

  return (
    <View className="w-full flex-col gap-2 my-8">
      {CURRENCIES.map(({ slug, Icon }) => (
        <Button
          key={slug}
          onPress={() => updateCurrencySlug(slug)}
          noShadow
          className="w-full flex-row items-center justify-between py-2 px-4"
        >
          <View className="flex-row items-center justify-center gap-4">
            <View className="flex-row items-center justify-center bg-white rounded-full p-2">
              <Icon size={18} color="black" strokeWidth={3.5} />
            </View>
            <Text className="font-sans-extrabold text-2xl text-white">
              {slug}
            </Text>
          </View>
          <View
            className={`h-[24px] flex items-center justify-center aspect-square rounded-full border-2 border-white ${
              currencySlug === slug ? "bg-white" : "bg-transparent"
            }`}
          >
            {currencySlug === slug && (
              <Check size={18} color="black" strokeWidth={3.5} />
            )}
          </View>
        </Button>
      ))}
    </View>
  );
};
