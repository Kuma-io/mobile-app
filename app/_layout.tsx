import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { PrivyProvider, usePrivy } from "@privy-io/expo";
import { SmartWalletsProvider } from "@privy-io/expo/smart-wallets";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { Toaster } from "sonner-native";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isReady } = usePrivy();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="setting" />
      </Stack>
      <Toaster invert />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <PrivyProvider
      appId={"clu7m7ye30hjzey4dp7byyvok"}
      clientId={"client-WY2jPdxGstKyN1bAmgECTcjE873iTVGiEskRBgZyf6Hir"}
    >
      <SmartWalletsProvider>
        <AppContent />
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
