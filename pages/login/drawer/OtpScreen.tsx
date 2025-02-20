import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { NumPad } from "@/components/ui/numpad";

interface OtpScreenProps {
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  onVerify: () => void;
  onBack: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  otp,
  setOtp,
  onVerify,
  onBack,
}) => {
  return (
    <View className="flex-1">
      <OtpHeader />
      <NumberDisplay number={otp} />
      <NumPad
        setNumber={setOtp}
        allowDecimals={false}
        maxValue={999999}
        isOtpMode
      />
      <Actions
        isValid={otp.length === 6}
        onPress={onVerify}
        buttonText="Verify"
        isOtpStep
        onBack={onBack}
      />
    </View>
  );
};

const OtpHeader = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-sans-extrabold pl-2 pt-4 text-3xl text-white">
        Enter OTP
      </Text>
    </View>
  );
};

const NumberDisplay = ({ number }: { number: string }) => {
  const currentPosition = number.length;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, []);

  return (
    <View className="my-8 flex w-full flex-1 flex-row items-center justify-center space-x-6">
      {Array.from({ length: 6 }).map((_, index) => {
        const isCurrent = index === currentPosition;
        const digit = index < number.length ? number[index] : "";

        return (
          <View key={index} className="h-12 w-12 items-center justify-center">
            {digit ? (
              <View className="flex-row items-center justify-center">
                <Text className="font-sans-bold text-5xl text-white">
                  {digit}
                </Text>
                {isCurrent && (
                  <Animated.View
                    className="absolute h-6 w-[2px] bg-white"
                    style={{
                      opacity: fadeAnim,
                    }}
                  />
                )}
              </View>
            ) : (
              <View
                className={`h-6 w-6 rounded-full ${
                  isCurrent ? "bg-white" : "bg-white/30"
                }`}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const Actions = ({
  isValid,
  onPress,
  buttonText,
  isOtpStep,
  onBack,
}: {
  isValid: boolean;
  onPress: () => void;
  buttonText: string;
  isOtpStep?: boolean;
  onBack?: () => void;
}) => {
  return (
    <View className="w-full flex-row items-center justify-between py-4">
      {isOtpStep && onBack && (
        <Button
          onPress={onBack}
          noShadow
          className="flex-row items-center justify-around aspect-square h-14 bg-slate-600/40"
        >
          <ChevronLeft size={24} color="white" />
        </Button>
      )}
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
