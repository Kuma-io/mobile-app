import React from 'react';
import { Text, View } from 'react-native';

export default function Header() {
  return (
    <View className="flex w-full flex-row items-center justify-between p-4">
      <Text className="font-sans-extrabold text-3xl">Settings</Text>
    </View>
  );
}
