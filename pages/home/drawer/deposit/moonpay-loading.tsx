import { Button } from "@/components/ui/button";
import useSettings from "@/store/useSettings";
import useUser from "@/store/useUser";
import { useMoonPaySdk } from "@moonpay/react-native-moonpay-sdk";
import * as WebBrowser from "expo-web-browser";
import { ChevronLeft } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

const MOONPAY_API_KEY = "pk_test_lhO0wUX5sQ5aKsEIIj7P3j7z15jwPPzL";

export default function MoonpayLoading({
  amount,
  onOpen,
}: {
  amount: number;
  onOpen: () => void;
}) {
  const { currencySlug } = useSettings();
  const { email, walletAddress } = useUser();
  const { openWithInAppBrowser, generateUrlForSigning, updateSignature } =
    useMoonPaySdk({
      sdkConfig: {
        flow: "buy",
        environment: "sandbox",
        params: {
          apiKey: MOONPAY_API_KEY,
          currencyCode: "eth",
          lockAmount: "true",
          baseCurrencyAmount: amount.toString(),
          baseCurrencyCode: currencySlug,
          email: email!,
          walletAddress: walletAddress!,
        },
        handlers: {
          async onTransactionCreated(props) {
            console.log("Moonpay transaction created", props);
          },
          async onTransactionCompleted(props) {
            console.log("Moonpay transaction completed", props);
            console.log("Transaction status:", props.status);
            console.log("Transaction ID:", props.id);
            console.log(
              "Amount:",
              props.baseCurrencyAmount,
              props.baseCurrency.code
            );
            console.log(
              "Received:",
              props.quoteCurrencyAmount,
              props.quoteCurrency.code
            );
          },
          async onClose() {
            console.log("Moonpay widget closed");
          },
          async onLogin(props) {
            console.log("Moonpay user logged in", props);
          },
        },
      },
      browserOpener: {
        open: async (url) => {
          await WebBrowser.openBrowserAsync(url);
        },
      },
    });

  useEffect(() => {
    const url = generateUrlForSigning({ variant: "inapp-browser" });
    const apiUrl = `https://kuma-server.vercel.app/sign-moonpay`;

    fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "1234567890",
      },
      method: "POST",
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((data) => {
        updateSignature(data.signature);
      });
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-sans-extrabold text-lg text-white flex-1">
        Loading...
      </Text>
      <Actions openWithInAppBrowser={openWithInAppBrowser} onOpen={onOpen} />
    </View>
  );
}

const Actions = ({
  openWithInAppBrowser,
  onOpen,
}: {
  openWithInAppBrowser: () => void;
  onOpen: () => void;
}) => {
  return (
    <View className="w-full flex-row items-center justify-between py-4 gap-8">
      <Button
        onPress={onOpen}
        className="flex-row items-center justify-around aspect-square h-14 bg-slate-600/40"
      >
        <ChevronLeft size={24} color="white" />
      </Button>
      <Pressable
        onPress={() => {
          openWithInAppBrowser();
        }}
        className="flex-row items-center justify-center h-14 flex-1 rounded-2xl bg-white"
      >
        <Text className="font-sans-extrabold text-lg">Buy</Text>
      </Pressable>
    </View>
  );
};
