import React from 'react';
import { Image, Text, View } from 'react-native';

export default function HeaderPage() {
  return (
    <View className="w-full flex-row items-start justify-center gap-1 px-8 py-4">
      <Image
        source={{
          uri: 'https://res.cloudinary.com/dvgc2tpte/image/upload/f_auto,q_auto:good,w_48,dpr_2.0,c_scale/v1738370119/logo_lmakde.png',
        }}
        className="mb-2 h-12 w-12"
      />
      <Text className="font-sans-black text-6xl">Kuma</Text>
    </View>
  );
}
