import * as haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';

interface PositionData {
  blockNumber: number;
  userBalance: string;
  // ... other fields if needed
}

interface ApiResponse {
  status: string;
  data: PositionData[];
}

interface ChartData {
  timestamp: number;
  value: number;
}

async function fetchPositionData(): Promise<ChartData[]> {
  try {
    const response = await fetch(
      'https://kuma-server.vercel.app/positions/0xb3a60b7e3e0cD790a3a6cc1c59627B70e350eea1/W/2'
    );
    const json: ApiResponse = await response.json();
    console.log(json);

    // Convert the data to the format expected by the chart
    return json.data
      .map((item) => ({
        // Convert block number to timestamp (approximate, assuming 12 second block time)
        timestamp: item.blockNumber * 12000,
        // Convert string to number and round to 6 decimal places
        value: Number(parseFloat(item.userBalance).toFixed(6)),
      }))
      .reverse(); // Reverse to show oldest to newest
  } catch (error) {
    console.error('Error fetching position data:', error);
    return [];
  }
}

const data = [
  {
    timestamp: 1625945400000,
    value: 33575.25,
  },
  {
    timestamp: 1625946300000,
    value: 33545.25,
  },
  {
    timestamp: 1625947200000,
    value: 33510.25,
  },
  {
    timestamp: 1625948100000,
    value: 33215.25,
  },
];

interface TimeFrameSelectorProps {
  timeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

export default function Chart() {
  const [timeFrame, setTimeFrame] = useState('1h');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPositionData();
        setChartData(data);
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [timeFrame]);

  function invokeHaptic() {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Heavy);
  }

  const onCurrentIndexChange = useCallback((index: number) => {
    setCurrentIndex(index);
    setDragging(true);
    invokeHaptic();
  }, []);

  if (isLoading) {
    return (
      <View className="w-full">
        <TimeFrameSelector timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />
        <View className="h-[200px] w-full items-center justify-center">
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View className="w-full">
        <TimeFrameSelector timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />
        <View className="h-[200px] w-full items-center justify-center">
          <Text>No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full">
      <TimeFrameSelector timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />
      <LineChart.Provider data={chartData} onCurrentIndexChange={onCurrentIndexChange}>
        <LineChart width={375} height={200} className="">
          <LineChart.Path color="black">
            <LineChart.Dot color="black" at={chartData.length - 1} hasPulse />
            <LineChart.Gradient />
          </LineChart.Path>
          <LineChart.CursorCrosshair
            color="black"
            onActivated={invokeHaptic}
            onEnded={() => {
              setDragging(false);
              invokeHaptic();
            }}
          />
          <LineChart.Tooltip cursorGutter={60} xGutter={16} yGutter={16} />
          <LineChart.CursorLine color="black" />
        </LineChart>
      </LineChart.Provider>
    </View>
  );
}

function TimeFrameSelector({ timeFrame, onTimeFrameChange }: TimeFrameSelectorProps) {
  const timeFrames = ['1h', '1d', '1w', '1m', '1y'];

  return (
    <View className="mx-auto flex w-[70%] flex-row justify-between">
      {timeFrames.map((frame) => (
        <TouchableOpacity key={frame} onPress={() => onTimeFrameChange(frame)} className="p-2">
          <Text
            className={`${timeFrame === frame ? 'text-black' : 'text-gray-500'} font-sans-bold `}>
            {frame.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
