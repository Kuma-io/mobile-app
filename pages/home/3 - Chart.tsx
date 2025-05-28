import { useEffect, useState, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-wagmi-charts";
import useUser from "@/store/useUser";
import useSettings from "@/store/useSettings";
import { triggerHaptic } from "@/utils/haptics";
import { UserPositionTimeframe } from "@/types";
interface TimeFrameSelectorProps {
  timeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

const timeframeMap: { [key: string]: UserPositionTimeframe } = {
  "1H": "1H",
  "1D": "1D",
  "1W": "1W",
  "1M": "1M",
  MAX: "MAX",
};

export default function Chart() {
  const { positions, getPositions } = useUser();
  const { timeframe, setTimeframe } = useSettings();

  const [chartData, setChartData] = useState<
    {
      timestamp: number;
      value: number;
    }[]
  >([]);

  const chartDataRef = useRef(chartData);

  useEffect(() => {
    if (positions && positions.length > 0) {
      const chartData = positions.map((item) => ({
        timestamp: item.timestamp,
        value: item.value,
      }));
      setChartData(chartData);
      chartDataRef.current = chartData;
    }
  }, [positions]);

  // Get the UI timeframe from API timeframe
  const getUITimeframe = (apiTimeframe: UserPositionTimeframe) => {
    return (
      Object.entries(timeframeMap).find(
        ([_, value]) => value === apiTimeframe
      )?.[0] || "1W"
    );
  };

  const timeFrame = getUITimeframe(timeframe);

  const handleTimeFrameChange = (newTimeFrame: string) => {
    const apiTimeframe = timeframeMap[newTimeFrame];
    setTimeframe(apiTimeframe as UserPositionTimeframe);
    getPositions();
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
        onCurrentIndexChange={(index) => {
          triggerHaptic("light");
          useUser.setState((state) => ({
            ...state,
            balance: chartDataRef.current[index].value,
          }));
        }}
      >
        <LineChart width={375} height={200}>
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
              useUser.setState((state) => ({
                ...state,
                balance: chartDataRef.current[chartData.length - 1].value,
              }));
            }}
          >
            {/* <LineChart.Tooltip cursorGutter={60} xGutter={16} yGutter={0} /> */}
            <LineChart.Tooltip cursorGutter={50} xGutter={30} yGutter={30}>
              <LineChart.DatetimeText
                format={({ value }) => {
                  "worklet";
                  const date = new Date(value);
                  if (timeFrame === "1H" || timeFrame === "1D") {
                    return date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                  return date.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
            </LineChart.Tooltip>
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
  const timeFrames = ["1H", "1D", "1W", "1M", "MAX"];

  return (
    <View className="pl-8 flex w-[65%] flex-row justify-between">
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
  );
}
