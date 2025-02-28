import React, { useEffect } from "react";
import { Text, View, Linking } from "react-native";
import Drawer from "@/components/ui/drawer";
import { useMoonPaySdk } from "@moonpay/react-native-moonpay-sdk";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/ui/button";

const MOONPAY_API_KEY = "pk_test_lhO0wUX5sQ5aKsEIIj7P3j7z15jwPPzL";

export default function OnRampDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const { openWithInAppBrowser, generateUrlForSigning, updateSignature } =
    useMoonPaySdk({
      sdkConfig: {
        flow: "buy",
        environment: "sandbox",
        params: {
          apiKey: "pk_test_lhO0wUX5sQ5aKsEIIj7P3j7z15jwPPzL",
        },
      },
      browserOpener: {
        open: async (url) => {
          await WebBrowser.openBrowserAsync(url);
        },
      },
    });

  // useEffect(() => {
  //   // The URL for signature should be sent to your backend, which should then
  //   // sign it with your API secret and return the signature.
  //   // Once you have the signature, you can update the SDK with it and show the widget.
  //   fetch("/sign-url", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer <token>",
  //     },
  //     method: "POST",
  //     body: JSON.stringify({
  //       url: generateUrlForSigning({ variant: WidgetVariant.Buy }),
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const signature = data.signature;
  //       updateSignature(signature);
  //     });
  // }, []);

  return (
    <Drawer isVisible={isVisible} onClose={onClose} isBlack>
      <View className="flex-1 items-center justify-center">
        <Button onPress={() => openWithInAppBrowser()} isWhite>
          <Text>Open in InApp browser</Text>
        </Button>
      </View>
    </Drawer>
  );
}
