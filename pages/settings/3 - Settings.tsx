import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { ChevronRight, BellDot, BadgeEuro } from "lucide-react-native";
import useStore from "@/store/useStore";
import ToggleSwitch from "toggle-switch-react-native";
import { toast } from "sonner-native";
export default function Settings({
  currencyModal,
  setCurrencyModal,
}: {
  currencyModal: boolean;
  setCurrencyModal: (value: boolean) => void;
}) {
  const {
    settings: { currencySlug, notification },
    updateNotification,
  } = useStore();
  return (
    <View className="w-full items-start justify-center px-8">
      <Text className="mb-2 font-sans-extrabold text-xl">Settings</Text>
      <Button
        onPress={() => {
          setCurrencyModal(!currencyModal);
        }}
        noShadow
        className="w-full flex-row items-center justify-between bg-white/10 py-2 "
      >
        <View className="flex-row items-center justify-center gap-5">
          <BadgeEuro size={30} color="black" />
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
          <BellDot size={26} color="black" />
          <View className="flex-col items-start justify-center">
            <Text className="font-sans-extrabold text-lg">Notifications</Text>
            <Text className="font-sans-thin text-sm text-gray-600">
              Get notified for daily rewards
            </Text>
          </View>
        </View>
        <View className="">
          <ToggleSwitch
            isOn={notification}
            onColor="#000"
            offColor="#d1d5db"
            size="small"
            onToggle={() =>
              toast.promise(updateNotification(!notification), {
                loading: "Updating notification",
                success: (result) =>
                  "Notification updated " + (result ? "on" : "off"),
                error: "Error updating notification",
              })
            }
          />
        </View>
      </Button>
    </View>
  );
}
