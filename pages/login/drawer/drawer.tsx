import { useLoginWithEmail } from "@privy-io/expo";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";

import { AuthScreen } from "./AuthScreen";
import { OtpScreen } from "./OtpScreen";
import Drawer from "@/components/ui/drawer";
import { toast } from "sonner-native";
import { triggerHaptic } from "@/utils/haptics";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginDrawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string>("");
  const [isOtpStep, setIsOtpStep] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const { state, sendCode, loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess: ({ email }) => {
      triggerHaptic("light");
      toast.success(`OTP sent to ${email}`);
    },
    onLoginSuccess: (user) => {
      triggerHaptic("success");
      toast.success(`Login successful`);
      onClose();
    },
    onError: (error) => {
      triggerHaptic("error");
      toast.error(`Error: ${error.message}`);
    },
  });

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      Keyboard.dismiss();
      setIsOtpStep(false);
      setOtp("");
      setEmail("");
    }
  }, [isVisible]);

  useEffect(() => {
    if (state.status === "awaiting-code-input") {
      setIsOtpStep(true);
    }
  }, [state, isVisible]);

  const handleMailLogin = useCallback(async () => {
    try {
      sendCode({ email });
    } catch (e) {
      console.error(
        "Unable to send OTP to user. Ensure your credentials are properly set: ",
        e
      );
    }
  }, [email]);

  const handleVerifyOtp = useCallback(async () => {
    await loginWithCode({ email, code: otp });
  }, [otp, onClose]);

  const isEmailValid = isValidEmail(email);

  return (
    <Drawer isVisible={isVisible} onClose={onClose} isBlack>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {isOtpStep ? (
          <OtpScreen
            otp={otp}
            setOtp={setOtp}
            onVerify={handleVerifyOtp}
            onBack={() => {
              setIsOtpStep(false);
              state.status = "initial";
            }}
          />
        ) : (
          <AuthScreen
            email={email}
            setEmail={setEmail}
            inputRef={inputRef}
            onLogin={handleMailLogin}
            isEmailValid={isEmailValid}
          />
        )}
      </KeyboardAvoidingView>
    </Drawer>
  );
}
