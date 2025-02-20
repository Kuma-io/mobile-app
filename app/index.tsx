import { SafeAreaView, Text, View } from "react-native";
import Constants from "expo-constants";
import LoginScreen from "@/components/LoginScreen";
import { usePrivy } from "@privy-io/expo";
import { UserScreen } from "@/components/UserScreen";

import Homepage from "@/pages/home/page";
import LoginPage from "@/pages/login/page";
export default function Index() {
  const { user } = usePrivy();
  return !user ? <LoginPage /> : <Homepage />;
}
