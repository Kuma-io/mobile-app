import * as haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-wagmi-charts";
import useStore, { Timeframe } from "@/store/useStore";
import { triggerHaptic } from "@/utils/haptics";

interface TimeFrameSelectorProps {
  timeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

// Map UI timeframes to API timeframes
const timeframeMap: { [key: string]: string } = {
  "1H": "H",
  "1D": "D",
  "1W": "W",
  "1Y": "Y",
};

export default function Chart() {
  const {
    data: { positionData },
    fetchingLoading,
    fetchPositionData,
    settings,
    updateSettings,
  } = useStore();

  // Get the UI timeframe from API timeframe
  const getUITimeframe = (apiTimeframe: string) => {
    return (
      Object.entries(timeframeMap).find(
        ([_, value]) => value === apiTimeframe
      )?.[0] || "1W"
    );
  };

  const timeFrame = getUITimeframe(settings.timeframe);

  // Transform the data to match the LineChart expected format
  const chartData = positionData.map((item) => ({
    timestamp: item.timestamp,
    value: item.balance,
  }));

  const handleTimeFrameChange = (newTimeFrame: string) => {
    const apiTimeframe = timeframeMap[newTimeFrame];
    updateSettings({ timeframe: apiTimeframe as Timeframe });
    fetchPositionData();
  };

  if (chartData.length === 0) {
    return (
      <View className="w-full">
        <TimeFrameSelector
          timeFrame={timeFrame}
          onTimeFrameChange={handleTimeFrameChange}
        />
        <View className="h-[200px] w-full items-center justify-center">
          <Text>No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full">
      <TimeFrameSelector
        timeFrame={timeFrame}
        onTimeFrameChange={handleTimeFrameChange}
      />
      <LineChart.Provider
        data={chartData}
        onCurrentIndexChange={() => {
          triggerHaptic("light");
        }}
      >
        <LineChart width={375} height={200} className="">
          <LineChart.Path color="black">
            <LineChart.Dot color="black" at={chartData.length - 1} hasPulse />
          </LineChart.Path>
          <LineChart.CursorCrosshair
            color="black"
            onActivated={() => {
              triggerHaptic("light");
            }}
            onEnded={() => {
              triggerHaptic("light");
            }}
          />
          <LineChart.Tooltip cursorGutter={60} xGutter={16} yGutter={16} />
        </LineChart>
      </LineChart.Provider>
    </View>
  );
}

function TimeFrameSelector({
  timeFrame,
  onTimeFrameChange,
}: TimeFrameSelectorProps) {
  const timeFrames = ["1H", "1D", "1W", "1Y"];

  return (
    <View className="mx-auto flex w-[70%] flex-row justify-between">
      {timeFrames.map((frame) => (
        <TouchableOpacity
          key={frame}
          onPress={() => onTimeFrameChange(frame)}
          className="p-2"
        >
          <Text
            className={`${
              timeFrame === frame ? "text-black" : "text-gray-500"
            } font-sans-bold `}
          >
            {frame}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
