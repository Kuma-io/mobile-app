import { Euro, DollarSign, PoundSterling, Check } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import useSettings from "@/store/useSettings";
import { triggerHaptic } from "@/utils/haptics";

export default function CurrencyModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      isVisible={isVisible}
      onClose={onClose}
      isBlack
      style={{ height: "auto" }}
    >
      <Header />
      <SelectCurrency onClose={onClose} />
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

const SelectCurrency = ({ onClose }: { onClose: () => void }) => {
  const { currencySlug, updateCurrencySlug } = useSettings();

  return (
    <View className="w-full flex-col gap-2 my-8">
      {CURRENCIES.map(({ slug, Icon }) => (
        <Button
          key={slug}
          onPress={() => {
            updateCurrencySlug(slug);
            triggerHaptic("success");
            onClose();
          }}
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
