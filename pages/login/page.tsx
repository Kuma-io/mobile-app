import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";

import Header from "./1 - Header";
import Video from "./2 - Video";
import Description from "./3 - Description";
import Action from "./4 - Action";

export default function Login() {
  return (
    <>
      <Stack.Screen options={{ title: "Login", headerShown: false }} />

      <SafeAreaView className="flex-1 items-center justify-end bg-white">
        <Header />
        <Video />
        <Description />
        <Action />
      </SafeAreaView>
    </>
  );
}
