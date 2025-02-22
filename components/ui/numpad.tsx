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

  const [isInDecimalMode, setIsInDecimalMode] = useState(false);

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
      (props.setNumber as React.Dispatch<React.SetStateAction<number>>)(
        (prev) => {
          if (prev === null) return digit;
          // If we're in decimal mode, add digits after decimal
          if (isInDecimalMode) {
            const decimalPlaces = (prev.toString().split(".")[1] || "").length;
            if (decimalPlaces >= 2) return prev; // Max 2 decimal places
            return Number(
              (prev + digit / Math.pow(10, decimalPlaces + 1)).toFixed(2)
            );
          }
          // Regular integer mode
          const newValue = prev * 10 + digit;
          return newValue > (props.maxValue ?? 999999.99) ? prev : newValue;
        }
      );
    }
  };

  const handleDecimalPress = () => {
    if (!props.allowDecimals) return;
    setPressedButton(".");
    setTimeout(() => setPressedButton(null), 200);

    if (!props.isOtpMode) {
      setIsInDecimalMode(true);
      (props.setNumber as React.Dispatch<React.SetStateAction<number>>)(
        (prev) => {
          if (prev === null) return 0;
          // If number already has decimals, don't add another decimal point
          if (prev.toString().includes(".")) return prev;
          return prev;
        }
      );
    }
  };

  const handleDeletePress = () => {
    setPressedButton("←");
    setTimeout(() => setPressedButton(null), 200);

    if (props.isOtpMode) {
      (props.setNumber as React.Dispatch<React.SetStateAction<string>>)(
        (prev) => prev.slice(0, -1)
      );
    } else {
      (props.setNumber as React.Dispatch<React.SetStateAction<number>>)(
        (prev) => {
          if (prev === null || prev === 0) {
            setIsInDecimalMode(false);
            return 0;
          }
          const strNum = prev.toString();
          // If we're deleting a decimal number
          if (strNum.includes(".")) {
            const [wholePart, decimalPart] = strNum.split(".");
            // If there's only one decimal digit left
            if (decimalPart.length === 1) {
              setIsInDecimalMode(false);
              return Number(wholePart);
            }
            // Remove last decimal digit
            return Number(strNum.slice(0, -1));
          }
          // Regular integer deletion
          const newValue = Math.floor(prev / 10);
          return newValue;
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
