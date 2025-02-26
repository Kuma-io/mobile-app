import { useLoginWithOAuth } from "@privy-io/expo";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import GoogleSvg from "@/assets/svg/google.svg";
import AppleSvg from "@/assets/svg/apple.svg";
import { toast } from "sonner-native";
import { triggerHaptic } from "@/utils/haptics";
import { Loading } from "@/components/ui/loading";
interface AuthScreenProps {
  email: string;
  setEmail: (value: string) => void;
  inputRef: React.RefObject<TextInput>;
  onLogin: () => void;
  isEmailValid: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  email,
  setEmail,
  inputRef,
  onLogin,
  isEmailValid,
}) => {
  return (
    <View className="flex-1">
      <Header />
      <EmailInput email={email} setEmail={setEmail} inputRef={inputRef} />
      <SocialLogin />
      <View className="flex-1" />
      <Actions isValid={isEmailValid} onPress={onLogin} buttonText="Login" />
    </View>
  );
};

const Header = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-sans-extrabold pl-2 text-3xl text-white pt-4">
        What is your favorite authentication method?
      </Text>
    </View>
  );
};

const EmailInput = ({
  email,
  setEmail,
  inputRef,
}: {
  email: string;
  setEmail: (value: string) => void;
  inputRef: React.RefObject<TextInput>;
}) => {
  return (
    <View className="w-full px-2 pt-8">
      <Text className="font-sans-semibold text-xl text-white/70 pb-2">
        With your email
      </Text>
      <TextInput
        ref={inputRef}
        value={email}
        onChangeText={setEmail}
        placeholder="johndoe@gmail.com"
        placeholderTextColor="rgba(255, 255, 255, 0.3)"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        cursorColor="white"
        selectionColor="white"
        textAlignVertical="center"
        className="font-sans-bold text-2xl text-white"
      />
    </View>
  );
};

const SocialLogin = () => {
  const { login, state } = useLoginWithOAuth({
    onSuccess: (user) => {
      if (user) {
        triggerHaptic("success");
        toast.success("Login successful");
      }
    },
    onError: (err) => {
      if (err) {
        triggerHaptic("error");
        toast.error("Login failed");
      }
    },
  });
  return (
    <View className="w-full px-2 pt-8">
      <Text className="font-sans-semibold text-xl text-white/70 pb-2">
        Or use
      </Text>
      <Button
        onPress={() => {
          login({
            provider: "google",
          });
        }}
        className="w-full flex-row items-center justify-between bg-white/10 p-4 rounded-[20px]"
      >
        <View className="flex-row items-center justify-center gap-3">
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center border-2 border-white">
            <GoogleSvg width={24} height={24} />
          </View>
          <Text className="font-sans-semibold text-lg text-white pl">
            Sign in with Google
          </Text>
        </View>
        <ChevronRight size={24} color="white" />
      </Button>
      <Button
        onPress={() => {
          login({
            provider: "apple",
          });
        }}
        className="w-full flex-row items-center justify-between bg-white/10 p-4 rounded-[20px] mt-1"
      >
        <View className="flex-row items-center justify-center gap-3">
          <View className="w-10 h-10  rounded-full items-center justify-center pb-[2px]">
            <AppleSvg width={28} height={28} />
          </View>
          <Text className="font-sans-semibold text-lg text-white">
            Sign in with Apple
          </Text>
        </View>
        <ChevronRight size={24} color="white" />
      </Button>
      {state.status === "loading" && <Loading />}
    </View>
  );
};

const Actions = ({
  isValid,
  onPress,
  buttonText,
}: {
  isValid: boolean;
  onPress: () => void;
  buttonText: string;
}) => {
  return (
    <View className="w-full flex-row items-center justify-between py-4">
      <View className="flex-1" />
      <Button
        onPress={onPress}
        isWhite
        disabled={!isValid}
        className={`flex-row items-center justify-around h-14 w-[35vw] ${
          !isValid ? "opacity-50" : ""
        }`}
      >
        <Text className="font-sans-extrabold text-lg">{buttonText}</Text>
        <ChevronRight size={24} color="black" />
      </Button>
    </View>
  );
};
