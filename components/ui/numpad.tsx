import React, { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "./button";

interface BaseNumPadProps {
  allowDecimals?: boolean;
  maxValue?: number;
}

interface NumPadStandardProps extends BaseNumPadProps {
  setNumber: React.Dispatch<React.SetStateAction<number | null>>;
  isOtpMode?: false;
}

interface NumPadWithdrawProps extends BaseNumPadProps {
  setNumber: React.Dispatch<React.SetStateAction<number>>;
  isOtpMode?: false;
}

interface NumPadOtpProps extends BaseNumPadProps {
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  isOtpMode: true;
}

type NumPadProps = NumPadStandardProps | NumPadOtpProps | NumPadWithdrawProps;

export function NumPad(props: NumPadProps) {
  const [pressedButton, setPressedButton] = useState<number | string | null>(
    null
  );

  const handleNumberPress = (digit: number) => {
    setPressedButton(digit);
    setTimeout(() => setPressedButton(null), 200);

    if (props.isOtpMode) {
      (props.setNumber as React.Dispatch<React.SetStateAction<string>>)(
        (prev) => {
          if (prev.length >= 6) return prev;
          return prev + digit.toString();
        }
      );
    } else {
      (props.setNumber as React.Dispatch<React.SetStateAction<number | null>>)(
        (prev) => {
          if (prev === null) return digit;
          const newValue = prev * 10 + digit;
          return newValue > (props.maxValue ?? 999999.99) ? prev : newValue;
        }
      );
    }
  };

  const handleDecimalPress = () => {
    setPressedButton(".");
    setTimeout(() => setPressedButton(null), 200);
    // Implementation for decimal functionality can be added here
  };

  const handleDeletePress = () => {
    setPressedButton("←");
    setTimeout(() => setPressedButton(null), 200);

    if (props.isOtpMode) {
      (props.setNumber as React.Dispatch<React.SetStateAction<string>>)(
        (prev) => prev.slice(0, -1)
      );
    } else {
      (props.setNumber as React.Dispatch<React.SetStateAction<number | null>>)(
        (prev) => {
          if (prev === null) return null;
          const newValue = Math.floor(prev / 10);
          return newValue === 0 ? null : newValue;
        }
      );
    }
  };

  const NumberButton = ({ value }: { value: number | string }) => (
    <Button
      onPress={() => {
        if (typeof value === "number") handleNumberPress(value);
        else if (value === ".") handleDecimalPress();
        else if (value === "←") handleDeletePress();
      }}
      animateBackground
      pressedBackgroundOpacity={0.4}
      className="flex-row items-center justify-around my-1 aspect-square h-24"
    >
      <Text className="font-sans-bold text-4xl text-white">{value}</Text>
    </Button>
  );

  const buttonRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [props.allowDecimals ? "." : "", 0, "←"],
  ];

  return (
    <View className="w-full items-center justify-center">
      {buttonRows.map((row, rowIndex) => (
        <View key={rowIndex} className="w-full flex-row justify-around">
          {row.map((value, columnIndex) =>
            value !== "" ? (
              <NumberButton key={value} value={value} />
            ) : (
              <View
                key={`empty-${rowIndex}-${columnIndex}`}
                className="my-1 aspect-square h-24"
              />
            )
          )}
        </View>
      ))}
    </View>
  );
}
