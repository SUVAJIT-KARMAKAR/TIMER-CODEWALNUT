import React from "react";
import { TimerItem } from "../TimerItem/TimerItem";
import { useTimerStore } from "../../store/useTimerStore";
import { EmptyState } from "../EmptyState";

export const TimerList: React.FC = () => {
  const { timers, theme } = useTimerStore();

  const textStyles = {
    primary: theme === "dark" ? "text-gray-200" : "text-gray-900",
    secondary: theme === "dark" ? "text-gray-400" : "text-gray-500",
    tertiary: theme === "dark" ? "text-gray-500" : "text-gray-400",
  };

  return (
    <div className="space-y-4 min-h-[400px] mt-10">
      {timers.length === 0 ? (
        <div className="h-[400px] flex flex-col items-center justify-center">
          <EmptyState />
          <p
            className={`text-center ${textStyles.secondary} text-xl font-medium`}
          >
            No timers yet. Add one to get started!
          </p>
          <p className={`text-center ${textStyles.tertiary} mt-2`}>
            Click the "Add Timer" button above to create your first timer.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {timers.map((timer) => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
        </div>
      )}
    </div>
  );
};
