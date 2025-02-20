import { Text, View } from 'react-native';

export default function Stats() {
  return (
    <View className="w-full flex-col items-start justify-between gap-2 px-8">
      <Text className="font-sans-bold text-lg text-gray-400">Statistics</Text>
      <View className="flex w-full flex-row items-center justify-around gap-4">
        <View className="h-24 flex-1 items-start justify-around rounded-2xl bg-black/5 p-4 py-2">
          <View className="w-full flex-row items-center justify-between gap-2">
            <Text className="font-sans-bold text-3xl">8.2%</Text>
            <Text className="mt-1 font-sans-bold text-sm text-red-400/80">▼ 12.45%</Text>
          </View>
          <Text className="font-sans-medium text-sm text-gray-500">Annual Yield</Text>
        </View>
        <View className="h-24 flex-1 items-start justify-around rounded-2xl bg-black/5 p-4">
          <View className="w-full flex-row items-center justify-between gap-2">
            <Text className="font-sans-bold text-3xl">$543</Text>
            <Text className="mt-1 font-sans-bold text-sm text-green-400/80">▲ 12.45%</Text>
          </View>
          <Text className="font-sans-medium text-sm text-gray-500">Profit Made</Text>
        </View>
      </View>
    </View>
  );
}
