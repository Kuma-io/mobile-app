import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function Balance() {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          'https://kuma-server.vercel.app/balance/0xb3a60b7e3e0cD790a3a6cc1c59627B70e350eea1'
        );
        const data = await response.json();
        if (data.status === 'success') {
          setBalance(data.data.userBalance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <View className="w-full items-start justify-center px-8 py-4">
      <Text className="mb-2 font-sans-bold text-lg text-gray-400">Balance</Text>
      <Text className="font-sans-extrabold text-4xl tracking-[0.05em]">
        {isLoading ? 'Loading...' : `${Number(balance).toFixed(2)}$`}
      </Text>
      <Text className="font-sans-bold text-sm text-green-400/80">▲ 12.45%</Text>
    </View>
  );
}
