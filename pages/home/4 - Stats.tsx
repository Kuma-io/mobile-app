import React from "react";
import useStore from "@/store/useStore";
import { Text, View } from "react-native";
import { formatYield } from "@/utils/formatYield";

export default function Stats() {
  return (
    <View className="w-full flex-col items-start justify-between gap-2 px-8">
      <Text className="font-sans-bold text-lg text-gray-400">Statistics</Text>
      <View className="flex w-full flex-row items-center justify-around gap-4">
        <AaveYield />
        <Rewards />
      </View>
    </View>
  );
}

const AaveYield = () => {
  return (
    <View className="h-24 flex-[0.9] items-start justify-around rounded-2xl bg-black p-4 pt-3">
      <Text className="font-sans-medium text-sm text-gray-400">
        Annual Yield
      </Text>
      <Text className="font-sans-bold text-3xl text-white">8.24%</Text>
      <Text className="mt-1 font-sans-bold text-sm text-red-500">▼ 12.45%</Text>
    </View>
  );
};

const Rewards = () => {
  const {
    data: { balance, principal, yieldValue },
  } = useStore();
  const annualYield = (yieldValue / principal) * 100;
  return (
    <View className="h-24 flex-1 items-start justify-around rounded-2xl bg-black p-4 pt-3">
      <Text className="font-sans-medium text-sm text-gray-400">
        Profit Made
      </Text>
      <Text className="font-sans-bold text-3xl text-white">
        {(() => {
          const value = formatYield(yieldValue);
          if (value.includes("e")) {
            const [base, exponent] = value.split("e");
            return (
              <>
                {`${base}`}
                <Text className="font-sans-thin text-lg">e{exponent} </Text>
                {`$`}
              </>
            );
          }
          return `${value}$`;
        })()}
      </Text>
      <Text className="mt-1 font-sans-semibold text-green-500 ">
        ▲{" "}
        {(() => {
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
          return `${value}$`;
        })()}
      </Text>
    </View>
  );
};
