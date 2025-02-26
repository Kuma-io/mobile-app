import { Stack } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import { Actions, Header, Account, Settings } from "@/pages/settings";
import { CurrencyModal } from "@/pages/settings/modal";

export default function SettingsPage() {
  const [currencyModal, setCurrencyModal] = useState(false);
  return (
    <>
      <Stack.Screen options={{ title: "Settings", headerShown: false }} />

      <SafeAreaView className="flex-1 bg-white">
        <Header />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="mb-2 w-full flex-1 flex-col items-center justify-start gap-6">
            <Account />
            <Settings
              currencyModal={currencyModal}
              setCurrencyModal={setCurrencyModal}
            />
          </View>
        </ScrollView>
        <Actions />
        <CurrencyModal
          isVisible={currencyModal}
          onClose={() => setCurrencyModal(false)}
        />
      </SafeAreaView>
    </>
  );
}
