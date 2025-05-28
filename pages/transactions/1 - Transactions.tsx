import React from "react";
import { View, Text } from "react-native";

import {
  ArrowDownToLine,
  ArrowUpToLine,
  CircleDollarSign,
} from "lucide-react-native";
import useUser from "@/store/useUser";
import useSettings from "@/store/useSettings";
import { CurrencySign } from "@/types/currency";
import { getRelativeTimeGroup } from "@/utils/getRelativeTimeGroup";

interface Action {
  timestamp: string;
  action: string;
  amount: string;
}

interface GroupedActions {
  [key: string]: Action[];
}

export default function Transactions() {
  const { actions, getActions } = useUser();
  const { currencySlug, currencyRate } = useSettings();

  const groupedActions: GroupedActions = actions.reduce((groups, action) => {
    const date = new Date(action.timestamp);
    const groupKey = getRelativeTimeGroup(date);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(action);
    return groups;
  }, {} as GroupedActions);

  const sortedGroups = Object.keys(groupedActions).sort((a, b) => {
    const getDays = (group: string): number => {
      if (group === "Today") return 0;
      if (group === "Yesterday") return 1;
      const match = group.match(/(\d+)/);
      if (!match) return Infinity;
      const num = parseInt(match[1]);
      if (group.includes("day")) return num;
      if (group.includes("week")) return num * 7;
      if (group.includes("month")) return num * 30;
      if (group.includes("year")) return num * 365;
      return Infinity;
    };
    return getDays(a) - getDays(b);
  });

  return (
    <View className="flex-1 w-full px-4 gap-4 mb-20">
      {actions.length === 0 ? (
        <View className="w-full h-16 flex-row items-center justify-center">
          <Text className="font-sans-medium text-sm">No transactions yet</Text>
        </View>
      ) : (
        <>
          {sortedGroups.map((group) => (
            <View
              key={group}
              className="w-full flex-col items-start justify-start gap-2"
            >
              <View className="flex-row items-center justify-between w-full">
                <Text className="font-sans-bold text-sm text-gray-400">
                  {group}
                </Text>
              </View>
              <View className="w-full border-2 border-black rounded-2xl">
                {groupedActions[group]
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .map((item, index) => (
                    <View
                      key={item.timestamp}
                      className={`w-full h-16 flex-row items-center justify-between my-auto px-4 ${
                        index !== groupedActions[group].length - 1
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
                              month: "2-digit",
                              day: "2-digit",
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
