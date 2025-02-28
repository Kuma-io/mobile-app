import React from "react";
import { View, Text } from "react-native";

import {
  ArrowDownToLine,
  ArrowUpToLine,
  CircleDollarSign,
} from "lucide-react-native";
import useStore from "@/store/useStore";
import { CurrencySign } from "@/types/currency";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayNumber = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${day} ${dayNumber} ${month}`;
};

interface Action {
  timestamp: string;
  action: string;
  amount: string;
}

interface GroupedActions {
  [key: string]: Action[];
}

export default function Transactions() {
  const {
    data: { actions },
    settings: { currencySlug, currencyRate },
  } = useStore();

  const groupedActions: GroupedActions = actions.reduce((groups, action) => {
    const date = new Date(action.timestamp);
    const dateKey = date.toISOString().split("T")[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(action);
    groups[dateKey].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return groups;
  }, {} as GroupedActions);

  const sortedDays = Object.keys(groupedActions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <View className="flex-1 w-full px-4 gap-4 mb-20">
      {actions.length === 0 ? (
        <View className="w-full h-16 flex-row items-center justify-center">
          <Text className="font-sans-medium text-sm">No transactions yet</Text>
        </View>
      ) : (
        <>
          {sortedDays.map((day, dayIndex) => (
            <View
              key={day}
              className="w-full flex-col items-start justify-start gap-2"
            >
              <View className="flex-row items-center justify-between w-full">
                <Text className="font-sans-bold text-sm text-gray-400">
                  {formatDate(day)}
                </Text>
              </View>
              <View className="w-full border-2 border-black rounded-2xl">
                {groupedActions[day].map((item, index) => (
                  <View
                    key={item.timestamp}
                    className={`w-full h-16 flex-row items-center justify-between my-auto px-4 ${
                      index !== groupedActions[day].length - 1
                        ? "border-b-2 border-black"
                        : ""
                    }`}
                  >
                    <View className="flex-row items-center justify-center gap-3">
                      <View className="w-9 h-9 bg-black rounded-full flex-row items-center justify-center">
                        {item.action.toLowerCase() === "deposit" ? (
                          <ArrowDownToLine
                            size={20}
                            color="white"
                            strokeWidth={3}
                          />
                        ) : item.action.toLowerCase() === "rewards" ? (
                          <CircleDollarSign size={20} color="white" />
                        ) : (
                          <ArrowUpToLine
                            size={20}
                            color="white"
                            strokeWidth={3}
                          />
                        )}
                      </View>
                      <View className="flex-col items-start justify-center">
                        <Text className="font-sans-bold text-lg">
                          {item.action[0].toUpperCase() +
                            item.action.slice(1).toLowerCase()}
                        </Text>
                        <Text className="font-sans-medium text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                    </View>
                    <Text className="font-sans-bold text-lg">
                      {item.action.toLowerCase() === "withdraw" ? "-" : ""}
                      {`${(Number(item.amount) * currencyRate).toFixed(
                        item.action.toLowerCase() === "rewards" ? 6 : 2
                      )}${
                        CurrencySign.find(
                          (currency) => currency.slug === currencySlug
                        )?.sign
                      }`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
}
