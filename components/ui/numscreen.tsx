import { Text, View } from "react-native";
import useStore from "@/store/useStore";
import { CurrencySign } from "@/types/currency";

export const NumScreen = ({ number }: { number: number }) => {
  const {
    settings: { currencySlug },
  } = useStore();
  const hasDecimals = number % 1 !== 0;
  const decimalPlaces = hasDecimals
    ? number.toString().split(".")[1].length
    : 0;
  const formattedNumber = number.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  });

  const textColorClass = number === 0 ? "text-gray-500" : "text-white";

  return (
    <View className="my-8 w-full flex-1 items-center justify-center">
      <View className="flex-row items-center">
        <Text className={`font-sans-extrabold text-4xl mt-2 ${textColorClass}`}>
          {
            CurrencySign.find((currency) => currency.slug === currencySlug)
              ?.sign
          }
        </Text>
        <Text className={`font-sans-extrabold ml-2 text-7xl ${textColorClass}`}>
          {formattedNumber}
        </Text>
      </View>
    </View>
  );
};
