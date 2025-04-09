import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { ChevronRight, UserRound, Wallet } from "lucide-react-native";
import useUser from "@/store/useUser";

export default function Account() {
  const { email, walletAddress } = useUser();
  return (
    <View className="w-full items-start justify-center px-8">
      <Text className="mb-2 font-sans-extrabold text-xl">Account</Text>
      <Button
        onPress={() => {}}
        noShadow
        className="w-full flex-row items-center justify-between bg-white/10 py-2 "
      >
        <View className="flex-row items-center justify-center gap-5">
          <UserRound size={28} color="black" />
          <View className="flex-col items-start justify-center">
            <Text className="font-sans-extrabold text-lg">Email</Text>
            <Text className="font-sans-thin text-sm text-gray-600">
              {email}
            </Text>
          </View>
        </View>
        <ChevronRight size={24} color="black" />
      </Button>
      <Button
        onPress={() => {}}
        noShadow
        className="w-full flex-row items-center justify-between bg-white/10 py-2 "
      >
        <View className="flex-row items-center justify-center gap-5">
          <Wallet size={26} color="black" />
          <View className="flex-col items-start justify-center">
            <Text className="font-sans-extrabold text-lg">Wallet</Text>
            <Text className="font-sans-thin text-sm text-gray-600">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </Text>
          </View>
        </View>
        <ChevronRight size={24} color="black" />
      </Button>
    </View>
  );
}
