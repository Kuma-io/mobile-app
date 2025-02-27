import React from "react";
import useStore from "@/store/useStore";
import { Pressable, Text, View } from "react-native";
import { formatYield } from "@/utils/formatYield";
import { router } from "expo-router";
import { CurrencySign } from "@/types/currency";
import { triggerHaptic } from "@/utils/haptics";

export default function Stats() {
  return (
    <View className="w-full flex-col items-start justify-between gap-2 px-8">
      <View className="flex-row items-center justify-between w-full">
        <Text className="font-sans-bold text-lg text-gray-400">Statistics</Text>
        <Pressable
          onPress={() => {
            router.push("/stats");
            triggerHaptic("light");
          }}
        >
          <Text className="font-sans-black text-sm">More</Text>
        </Pressable>
      </View>
      <View className="flex w-full flex-row items-center justify-around gap-4">
        <AaveYield />
        <Rewards />
      </View>
    </View>
  );
}

const AaveYield = () => {
  const { stats } = useStore();
  const annualYield = stats.apy;
  const aaveApyVariation = stats.apyVariation;
  return (
    <View className="h-24 flex-1 items-center rounded-2xl bg-black">
      <View className="items-start flex-1 justify-around p-4 pt-3 pl-8">
        <Text className="font-sans-medium text-sm text-gray-400">
          Live Yield
        </Text>
        <Text className="font-sans-bold text-3xl text-white">
          {(annualYield * 100).toFixed(3)}%
        </Text>
        <Text
          className={`mt-1 font-sans-bold text-sm ${
            aaveApyVariation < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {aaveApyVariation < 0 ? "▼" : "▲"}
          {aaveApyVariation.toFixed(3)}%
        </Text>
      </View>
    </View>
  );
};

const Rewards = () => {
  const {
    data: { principal, yieldValue },
    settings: { currencySlug, currencyRate },
  } = useStore();
  const annualYield = principal > 0 ? (yieldValue / principal) * 100 : 0;
  return (
    <View className="h-24 flex-1 items-center justify-center rounded-2xl bg-black">
      <View className="items-start flex-1 justify-around p-4 pt-3 pl-6">
        <Text className="font-sans-medium text-sm text-gray-400">
          Profit Made
        </Text>
        <Text className="font-sans-bold text-3xl text-white">
          {(() => {
            const value = formatYield(yieldValue * currencyRate);
            if (value.includes("e")) {
              const [base, exponent] = value.split("e");
              return (
                <>
                  {`${base}`}
                  <Text className="font-sans-thin text-lg">e{exponent} </Text>
                  {`${
                    CurrencySign.find(
                      (currency) => currency.slug === currencySlug
                    )?.sign
                  }`}
                </>
              );
            }
            return `${value}${
              CurrencySign.find((currency) => currency.slug === currencySlug)
                ?.sign
            }`;
          })()}
        </Text>
        <Text
          className={`mt-1 font-sans-semibold ${
            principal === 0 ? "text-gray-400" : "text-green-500"
          }`}
        >
          {principal === 0 ? "- " : "▲ "}
          {(() => {
            if (annualYield === 0) return "0%";
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
    </View>
  );
};
