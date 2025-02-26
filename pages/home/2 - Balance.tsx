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
    <View className="w-full items-start justify-center px-8 pb-4">
      <Text className="mb-2 font-sans-bold text-lg text-gray-400">Balance</Text>
      <Text className="font-sans-extrabold text-4xl tracking-[0.05em]">
        {`${(balance * currencyRate).toFixed(6)}${
          CurrencySign.find((currency) => currency.slug === currencySlug)?.sign
        }`}
      </Text>
      <Text
        className={`font-sans-bold text-sm ${
          principal === 0 ? "text-gray-400" : "text-green-500"
        }`}
      >
        {principal === 0 ? "- " : "▲ "}
        {(() => {
          if (principal === 0) return "0%";
          const value = formatYield(annualYield);
          if (value.includes("e")) {
            const [base, exponent] = value.split("e");
            return (
              <>
                {`${base}`}
                <Text className="font-sans-thin text-sm">e{exponent} </Text>
                {`%`}
              </>
            );
          }
          return `${value}%`;
        })()}
      </Text>
    </View>
  );
}
