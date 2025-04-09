import React, { useEffect, useState } from "react";
import { Text, View, Linking } from "react-native";
import Drawer from "@/components/ui/drawer";
import { useMoonPaySdk } from "@moonpay/react-native-moonpay-sdk";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react-native";
import { NumPad } from "@/components/ui/numpad";
import { NumScreen } from "@/components/ui/numscreen";
import useUser from "@/store/useUser";
import useSettings from "@/store/useSettings";

const MOONPAY_API_KEY = "pk_test_lhO0wUX5sQ5aKsEIIj7P3j7z15jwPPzL";

export default function OnRampDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [number, setNumber] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setNumber(0);
    }
  }, [isVisible]);

  const { email, walletAddress } = useUser();
  const { currencySlug } = useSettings();
  const { openWithInAppBrowser, generateUrlForSigning, updateSignature } =
    useMoonPaySdk({
      sdkConfig: {
        flow: "buy",
        environment: "sandbox",
        params: {
          apiKey: MOONPAY_API_KEY,
          currencyCode: "eth",
          lockAmount: "true",
          baseCurrencyAmount: number.toString(),
          baseCurrencyCode: currencySlug,
          email: email!,
          walletAddress: walletAddress!,
        },
        handlers: {
          onAuthToken: async (token) => {
            console.log("token", token);
          },
        },
      },
      browserOpener: {
        open: async (url) => {
          await WebBrowser.openBrowserAsync(url);
        },
      },
    });

  const fetchSignature = async () => {
    const apiUrl = `https://kuma-server.vercel.app/sign-moonpay`;
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "1234567890",
      },
      method: "POST",
      body: JSON.stringify({
        url: generateUrlForSigning({ variant: "inapp-browser" }),
      }),
    });
    const data = await response.json();
    console.log("signature", data.signature);
    updateSignature(data.signature);
  };

  useEffect(() => {
    fetchSignature();
  }, [number]);

  return (
    <Drawer isVisible={isVisible} onClose={onClose} isBlack>
      <Header />
      <NumScreen number={number} />
      <NumPad setNumber={setNumber} allowDecimals maxValue={999999.99} />
      <Actions isLoading={isLoading} onDeposit={openWithInAppBrowser} />
    </Drawer>
  );
}

const Header = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-sans-extrabold pl-2 text-3xl text-white/80">
        Deposit
      </Text>
    </View>
  );
};

const Actions = ({
  isLoading,
  onDeposit,
}: {
  isLoading: boolean;
  onDeposit: () => Promise<void>;
}) => {
  return (
    <View className="w-full flex-row items-center justify-end py-4">
      <Button
        onPress={onDeposit}
        isWhite
        disabled={isLoading}
        className="h-14 w-[35vw] flex-row items-center justify-around pl-1"
      >
        <Text className="font-sans-extrabold text-lg">Deposit</Text>
        <ChevronRight size={24} color="black" />
      </Button>
    </View>
  );
};
