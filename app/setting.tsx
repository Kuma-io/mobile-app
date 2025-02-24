import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import Header from "@/pages/settings/1 - Header";
import Settings from "@/pages/settings/3 - Settings";
import Actions from "@/pages/settings/5 - Actions";
import Account from "@/pages/settings/2 - Account";
export default function SettingsPage() {
  return (
    <>
      <Stack.Screen options={{ title: "Settings", headerShown: false }} />

      <SafeAreaView className="flex-1 bg-white">
        <Header />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="mb-2 w-full flex-1 flex-col items-center justify-start gap-6">
            <Account />
            <Settings />
          </View>
        </ScrollView>
        <Actions />
      </SafeAreaView>
    </>
  );
}
