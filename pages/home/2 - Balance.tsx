import { Text, View } from "react-native";
import useStore from "@/store/useStore";
import { parseUnits } from "viem";

export default function Balance() {
  const {
    data: { balance, principal, yieldValue },
  } = useStore();
  const annualYield = (yieldValue / principal) * 100;

  return (
    <View className="w-full items-start justify-center px-8 pb-4">
      <Text className="mb-2 font-sans-bold text-lg text-gray-400">Balance</Text>
      <Text className="font-sans-extrabold text-4xl tracking-[0.05em]">
        {`${balance}$`}
      </Text>
      <Text className="font-sans-bold text-sm text-green-500">
        ▲{`${annualYield}%`}
      </Text>
    </View>
  );
}
