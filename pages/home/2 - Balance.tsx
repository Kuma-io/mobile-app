import { Text, View } from "react-native";
import React from "react";
import useStore from "@/store/useStore";
import { formatYield } from "@/utils/formatYield";
import { CurrencySign } from "@/types/currency";

export default function Balance() {
  const {
    data: { balance, principal, yieldValue },
    settings: { currencySlug, currencyRate },
  } = useStore();
  const annualYield = principal > 0 ? (yieldValue / principal) * 100 : 0;

  return (
    <View className="w-full items-start justify-center px-8">
      <Text className="mb-2 font-sans-bold text-lg text-gray-400">Balance</Text>
      <Text className="font-sans-extrabold text-4xl tracking-[0.05em]">
        {`${(balance * currencyRate).toFixed(6)}${
          CurrencySign.find((currency) => currency.slug === currencySlug)?.sign
        }`}
      </Text>
      <View className="flex-row items-center justify-start w-full">
        <Text
          className={`font-sans-medium text-xs ${
            principal === 0 ? "text-gray-400" : "text-black/90"
          }`}
        >
          {principal === 0 ? "- " : "▲ "}
        </Text>
        <Text
          className={`font-sans-black tracking-[0.05em] ${
            principal === 0 ? "text-gray-400" : "text-black/90"
          }`}
        >
          {`${((balance - principal) * currencyRate).toFixed(6)}`}
        </Text>
        <Text
          className={`font-sans-extrabold text-sm tracking-[0.05em] ${
            principal === 0 ? "text-gray-400" : "text-black/90"
          }`}
        >
          {
            CurrencySign.find((currency) => currency.slug === currencySlug)
              ?.sign
          }
        </Text>
      </View>
    </View>
  );
}
