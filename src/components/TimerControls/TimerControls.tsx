import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimerStore } from "../store/useTimerStore";

// Props interface for the TimerControls component
interface TimerControlsProps {
  isRunning: boolean;
  remainingTime: number;
  duration: number;
  onToggle: () => void;
  onRestart: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  remainingTime,
  onToggle,
  onRestart,
}) => {
  const { theme } = useTimerStore();
  const isCompleted = remainingTime <= 0;

  // Theme-aware button styles
  const getButtonStyles = (type: "restart" | "running" | "stopped") => {
    const baseStyles = "p-3 rounded-full transition-colors";

    if (theme === "dark") {
      switch (type) {
        case "restart":
          return `${baseStyles} bg-blue-900/50 text-blue-400 hover:bg-blue-800/60`;
        case "running":
          return `${baseStyles} bg-red-900/50 text-red-400 hover:bg-red-800/60`;
        case "stopped":
          return `${baseStyles} bg-green-900/50 text-green-400 hover:bg-green-800/60`;
      }
    } else {
      switch (type) {
        case "restart":
          return `${baseStyles} bg-blue-100 text-blue-600 hover:bg-blue-200`;
        case "running":
          return `${baseStyles} bg-red-100 text-red-600 hover:bg-red-200`;
        case "stopped":
          return `${baseStyles} bg-green-100 text-green-600 hover:bg-green-200`;
      }
    }
  };

  // Render the restart button if the timer is completed
  if (isCompleted) {
    return (
      <button
        onClick={onRestart}
        className={getButtonStyles("restart")}
        title="Restart Timer"
      >
        <RotateCcw className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={getButtonStyles(isRunning ? "running" : "stopped")}
      title={isRunning ? "Pause Timer" : "Start Timer"}
    >
      {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
    </button>
  );
};
