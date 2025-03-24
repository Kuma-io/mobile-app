import { View, Text, Pressable } from "react-native";
import { useMoonPaySdk } from "@moonpay/react-native-moonpay-sdk";
import * as WebBrowser from "expo-web-browser";
import useStore from "@/store/useStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const MOONPAY_API_KEY = "pk_test_lhO0wUX5sQ5aKsEIIj7P3j7z15jwPPzL";

type OnInitiateDepositProps = {
  transactionId: string;
  cryptoCurrency: {
    id: string;
    name: string;
    code: string;
    contractAddress: string | null;
    chainId: string | null;
    coinType: string | null;
    networkCode: string | null;
  };
  fiatCurrency: {
    id: string;
    name: string;
    code: string;
  };
  /** Crypto amount in its base unit (0.123 ETH === "0.123") */
  cryptoCurrencyAmount: string;
  /** Crypto amount in its smallest unit (1 ETH === 1x10^18) */
  cryptoCurrencyAmountSmallestDenomination: string;
  /** Fiat amount in its base unit ($1.23 === "1.23"). Only set for fixed quotes. */
  fiatCurrencyAmount: string | null;
  depositWalletAddress: string;
};

export default function MoonpayLoading({
  amount,
  onOpen,
}: {
  amount: number;
  onOpen: () => void;
}) {
  const { settings, data } = useStore();
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
          baseCurrencyCode: settings.currencySlug,
          email: data.email,
          walletAddress: data.walletAddress!,
        },
        handlers: {
          async onInitiateDeposit(properties: OnInitiateDepositProps) {
            // Your own crypto deposit code
            const {
              cryptoCurrency,
              cryptoCurrencyAmount,
              depositWalletAddress,
            } = properties;
            const depositId = await deposit(
              cryptoCurrency.code,
              cryptoCurrencyAmount,
              depositWalletAddress
            );
            return { depositId };
          },
          // onClose: async () => {
          //   console.log("Moonpay closed");
          //   // Handle widget closure
          //   // You can add navigation or state updates here
          // },
          // onLogin: async ({ isRefresh }) => {
          //   console.log("Moonpay login", { isRefresh });
          //   // Handle login/refresh
          //   // isRefresh indicates if this is a token refresh rather than new login
          // },
          // onTransactionCreated: async (props) => {
          //   console.log("Moonpay transaction created", props);
          //   // Handle transaction creation
          //   // props contains transaction details like id, status, amounts
          // },
          // onTransactionCompleted: async (props) => {
          //   console.log("Moonpay transaction completed", props);
          //   // Handle transaction completion
          //   // props contains full transaction details including fees, amounts, status
          // },
        },
      },
      browserOpener: {
        open: async (url) => {
          await WebBrowser.openBrowserAsync(url);
        },
      },
    });

  useEffect(() => {
    const apiUrl = `https://kuma-server.vercel.app/sign-moonpay`;
    fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "1234567890",
      },
      method: "POST",
      body: JSON.stringify({
        url: generateUrlForSigning({ variant: "inapp-browser" }),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "data",
          generateUrlForSigning({ variant: "inapp-browser" })
        );
        const signature = data.signature;
        console.log("signature", signature);
        updateSignature(signature);
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
