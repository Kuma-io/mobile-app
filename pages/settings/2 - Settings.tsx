import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import { BadgeDollarSign, ChevronRight } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import AppleSvg from "@/assets/svg/apple.svg";
import GoogleSvg from "@/assets/svg/google.svg";
import useStore from "@/store/useStore";
import { useSmartWallets } from "@privy-io/expo/smart-wallets";
import { transfer } from "@/lib/transfer";
export default function Settings() {
  const { logout, user } = usePrivy();
  const {
    settings,
    updateSettings,
    data: { walletAddress },
  } = useStore();
  const { client } = useSmartWallets();
  const smartWallet = user?.linked_accounts.find(
    (account) => account.type === "smart_wallet"
  );
  return (
    <View className="w-full flex-1  px-4">
      <View className="w-full gap-2 rounded-xl bg-white p-4">
        <View className="w-full flex-row items-center justify-between ">
          <View className="flex-row items-center gap-1">
            <BadgeDollarSign size={20} color="#000" />
            <Text className="font-sans-semibold text-lg">account</Text>
            <Text className="font-sans-semibold text-lg" />
          </View>
          <ChevronRight size={20} color="gray" />
        </View>
        <View className="w-full flex-row items-center justify-between ">
          <View className="flex-row items-center gap-1">
            <BadgeDollarSign size={20} color="#000" />
            <Text className="font-sans-semibold text-lg">
              {user?.linked_accounts[0].type === "email"
                ? user?.linked_accounts[0].address
                : ""}
            </Text>
          </View>
          <ChevronRight size={20} color="gray" />
        </View>
      </View>
      <Button
        onPress={() => {}}
        noShadow
        className="w-full flex-row items-center justify-between bg-white/10 p-4 rounded-[20px]"
      >
        <View className="flex-row items-center justify-center gap-3">
          <View className="w-10 h-10  rounded-full items-center justify-center pb-[2px]">
            <GoogleSvg width={28} height={28} />
          </View>
          <Text className="font-sans-semibold text-lg">
            Sign in with Google
          </Text>
        </View>
        <ChevronRight size={24} color="black" />
      </Button>
      <Text>{walletAddress}</Text>
      <Text>{smartWallet?.address}</Text>
      <Button
        className="h-16 w-[35vw] flex-row items-center justify-around bg-red-500/90 pl-1"
        onPress={() => {
          transfer(client!, 5).then((receipt) => {
            console.log(receipt);
          });
        }}
      >
        <Text>Transfer</Text>
      </Button>
      {/* <Text>{JSON.stringify(client)}</Text> */}
    </View>
  );
}
