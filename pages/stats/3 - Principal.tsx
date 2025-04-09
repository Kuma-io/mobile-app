import { View, Text } from "react-native";
import useUser from "@/store/useUser";
import { CurrencySign } from "@/types/currency";
import useSettings from "@/store/useSettings";
export default function Principal() {
  const { principal } = useUser();
  const { currencySlug, currencyRate } = useSettings();
  return (
    <View className="w-full flex-row items-center justify-between px-6 pb-4">
      <View className="flex-col items-start">
        <Text className="mb-2 font-sans-bold text-lg text-gray-400">
          Total Deposited
        </Text>
        <Text className="font-sans-extrabold text-4xl tracking-[0.05em] pl-2">
          {`${(principal * currencyRate).toFixed(2)}${
            CurrencySign.find((currency) => currency.slug === currencySlug)
              ?.sign
          }`}
        </Text>
      </View>
    </View>
  );
}
