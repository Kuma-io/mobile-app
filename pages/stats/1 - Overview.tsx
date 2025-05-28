import { Text, View } from "react-native";
import React from "react";
import useAave from "@/store/useAave";
import { CurrencySign } from "@/types/currency";
import useSettings from "@/store/useSettings";

export default function Overview() {
  const { aus, apy } = useAave();
  const { currencySlug, currencyRate } = useSettings();

  return (
    <View className="w-full flex-row items-center justify-between px-6 pb-4">
      <View className="flex-col items-start">
        <Text className="mb-2 font-sans-bold text-lg text-gray-400">
          Protocol Supplied
        </Text>
        <Text className="font-sans-extrabold text-4xl tracking-[0.05em] pl-2">
          {`${((aus * currencyRate) / 1000000).toFixed(2)}M ${
            CurrencySign.find((currency) => currency.slug === currencySlug)
              ?.sign
          }`}
        </Text>
      </View>
      <View className="flex-col items-end">
        <Text className="mb-2 font-sans-bold text-lg text-gray-400">
          Live APY
        </Text>
        <Text className="font-sans-extrabold text-4xl tracking-[0.05em] pr-2">
          {(apy * 100).toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}
