import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Text, View } from "react-native";

import LoginDrawer from "./drawer/drawer";
import { Button } from "@/components/ui/button";

export default function ActionPage() {
  const [isLoginDrawerVisible, setIsLoginDrawerVisible] = useState(false);
  return (
    <>
      <View className="w-full items-end p-6">
        <Button
          onPress={() => {
            setIsLoginDrawerVisible(true);
          }}
          className="flex-row items-center justify-around h-16 w-[40vw]"
        >
          <Text className="font-sans-extrabold text-lg text-white">
            Enter App
          </Text>
          <ChevronRight size={24} color="white" />
        </Button>
      </View>
      <LoginDrawer
        isVisible={isLoginDrawerVisible}
        onClose={() => setIsLoginDrawerVisible(false)}
      />
    </>
  );
}
