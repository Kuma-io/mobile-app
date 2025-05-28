import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useUser from "@/store/useUser";
import useSettings from "@/store/useSettings";
import useAave from "@/store/useAave";
import { resetCache } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { triggerHaptic } from "@/utils/haptics";
import { toast } from "sonner-native";

export default function Actions() {
  const insets = useSafeAreaInsets();
  const { logout } = usePrivy();
  const { reset: resetUser } = useUser();
  const { reset: resetSettings } = useSettings();
  const { reset: resetAave } = useAave();
  return (
    <View
      style={{
        backgroundColor: "transparent",
        position: "absolute",
        bottom: insets.bottom,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
      className="flex w-full flex-row items-center justify-between gap-8 px-8 pb-4"
    >
      <Button
        onPress={() => {
          router.back();
        }}
        noShadow
        className="flex-row items-center justify-around aspect-square h-14"
      >
        <ChevronLeft size={24} color="white" />
      </Button>
      <Button
        onPress={async () => {
          try {
            await logout();
            resetUser();
            resetSettings();
            resetAave();
            resetCache();
            router.replace("/");
            triggerHaptic("error");
            toast.success("Logged out");
          } catch (error) {
            toast.error("Error logging out");
          }
        }}
        className="h-16 w-[35vw] flex-row items-center justify-around bg-red-500/90 pl-1"
      >
        <Text className="flex-row items-center justify-around font-sans-extrabold text-lg text-white">
          Log Out
        </Text>
        <ChevronRight size={24} color="white" />
      </Button>
    </View>
  );
}
