import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import GoogleSvg from "@/assets/svg/google.svg";
import {
  ChevronRight,
  CircleUserRound,
  UserRound,
  Wallet,
} from "lucide-react-native";
import { usePrivy } from "@privy-io/expo";
import useStore from "@/store/useStore";
import ToggleSwitch from "toggle-switch-react-native";

export default function Settings() {
  const { user } = usePrivy();
  const {
    data: { walletAddress },
    settings: { currencySlug },
  } = useStore();

  const emailAccount = user?.linked_accounts.find(
    (account) => account.type === "email" || account.type === "google_oauth"
  );
  return (
    <View className="w-full items-start justify-center px-8">
      <Text className="mb-2 font-sans-extrabold text-xl">Settings</Text>
      <Button
        onPress={() => {}}
        noShadow
        className="w-full flex-row items-center justify-between bg-white/10 py-2 "
      >
        <View className="flex-row items-center justify-center gap-5">
          <UserRound size={28} color="black" />
          <View className="flex-col items-start justify-center">
            <Text className="font-sans-extrabold text-lg">Currency</Text>
            <Text className="font-sans-thin text-sm text-gray-600">
              {currencySlug}
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
            <Text className="font-sans-extrabold text-lg">Notifications</Text>
            <Text className="font-sans-thin text-sm text-gray-600">
              Get notified for daily rewards
            </Text>
          </View>
        </View>
        <View className="">
          <ToggleSwitch
            isOn={true}
            onColor="#000"
            offColor="#d1d5db"
            size="small"
            onToggle={(isOn) => console.log("changed to : ", isOn)}
          />
        </View>
      </Button>
    </View>
  );
}
