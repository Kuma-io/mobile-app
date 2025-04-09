import { useCallback, useEffect, useState, useRef } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-wagmi-charts";
import { triggerHaptic } from "@/utils/haptics";
import React from "react";
import { ApyTimeframe } from "@/types";
import useProtocol from "@/store/useProtocol";
interface TimeFrameSelectorProps {
  timeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

// Map UI timeframes to API timeframes
const timeframeMap: { [key: string]: ApyTimeframe } = {
  "1W": "1W",
  "1M": "1M",
  "6M": "6M",
  "1Y": "1Y",
};

export default function Chart() {
  const { apyHistory, timeframe, apyAvg, fetchApyHistory, updateTimeframe } =
    useProtocol();

  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<
    {
      timestamp: number;
      value: number;
    }[]
  >([]);

  const chartDataRef = useRef(chartData);

  // Find index of value closest to avgApy
  const getClosestValueIndex = useCallback(
    (data: typeof chartData, target: number) => {
      // target is already in decimal form (e.g. 0.048), so multiply by 100 to match chart values
      const targetPercentage = target * 100;
      const closestIndex = data.reduce((closest, current, index) => {
        const currentDiff = Math.abs(current.value - targetPercentage);
        const closestDiff = Math.abs(data[closest].value - targetPercentage);
        return currentDiff < closestDiff ? index : closest;
      }, 0);

      console.log("Target APY:", targetPercentage.toFixed(2) + "%");
      console.log(
        "Found closest value:",
        data[closestIndex].value.toFixed(2) + "%"
      );
      console.log("At index:", closestIndex);

      return closestIndex;
    },
    []
  );

  useEffect(() => {
    // Create chart data points with timestamps
    const now = Date.now();
    const timeframeInDays = {
      "1W": 7,
      "1M": 30,
      "6M": 180,
      "1Y": 365,
    }[timeframe];

    const timestampStep =
      (timeframeInDays * 24 * 60 * 60 * 1000) / apyHistory.length;

    const chartData = apyHistory.map((value, index) => ({
      timestamp: now - (apyHistory.length - 1 - index) * timestampStep,
      value: value * 100,
    }));

    setChartData(chartData);
    chartDataRef.current = chartData;
  }, [apyHistory]);

  // Get the UI timeframe from API timeframe
  const getUITimeframe = (apiTimeframe: string) => {
    return (
      Object.entries(timeframeMap).find(
        ([_, value]) => value === apiTimeframe
      )?.[0] || "1W"
    );
  };

  const timeFrame = getUITimeframe(timeframe);

  const handleTimeFrameChange = async (newTimeFrame: string) => {
    const apiTimeframe = timeframeMap[newTimeFrame];
    updateTimeframe(apiTimeframe as ApyTimeframe);
    setIsLoading(true);
    try {
      await fetchApyHistory();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="w-full">
        <TimeFrameSelector
          timeFrame={timeFrame}
          onTimeFrameChange={handleTimeFrameChange}
        />
        <View className="h-[200px] w-full items-center justify-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      </View>
    );
  }

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
        onCurrentIndexChange={(index) => {
          triggerHaptic("light");
        }}
      >
        <LineChart width={375} height={200}>
          <LineChart.Path color="black">
            <LineChart.Dot color="black" at={chartData.length - 1} hasPulse />
            <LineChart.HorizontalLine
              at={{ index: getClosestValueIndex(chartData, apyAvg) }}
              color="gray"
            />
          </LineChart.Path>
          <View className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white px-1 rounded">
            <Text className="text-xs text-gray-500">
              Avg {(apyAvg * 100).toFixed(2)}%
            </Text>
          </View>
          <LineChart.CursorCrosshair
            color="black"
            onActivated={() => {
              triggerHaptic("light");
            }}
            onEnded={() => {
              triggerHaptic("light");
            }}
          >
            <LineChart.Tooltip cursorGutter={60} xGutter={16} yGutter={16} />
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChart.Provider>
    </View>
  );
}

function TimeFrameSelector({
  timeFrame,
  onTimeFrameChange,
}: TimeFrameSelectorProps) {
  const timeFrames = ["1W", "1M", "6M", "1Y"];

  return (
    <>
      <Text className="font-sans-bold text-lg text-gray-400 ml-6">
        APY History
      </Text>
      <View className="pl-8 flex w-[55%] flex-row justify-between">
        {timeFrames.map((frame) => (
          <TouchableOpacity
            key={frame}
            onPress={() => onTimeFrameChange(frame)}
            className="p-2"
          >
            <Text
              className={`${
                timeFrame === frame ? "text-black" : "text-gray-500"
              } font-sans-bold`}
            >
              {frame}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
