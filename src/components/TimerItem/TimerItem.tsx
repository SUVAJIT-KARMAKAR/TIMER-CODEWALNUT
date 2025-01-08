import React, { useEffect, useRef, useState } from "react";
import { Trash2, RotateCcw, Pencil } from "lucide-react";
import { Timer } from "../../types/timer";
import { formatTime } from "../../utils/time";
import { useTimerStore } from "../../store/useTimerStore";
import { toast } from "sonner";
import { TimerModal } from "../TimerModal/TimerModal";
import { TimerAudio } from "../../utils/audio";
import { TimerControls } from "./TimerControls";
import { TimerProgress } from "../TimerProgress";
import { Button } from "./Button";

// Props interface for the TimerItem component
interface TimerItemProps {
  timer: Timer; 
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { deleteTimer, restartTimer } = useTimerStore(); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime); 
  const [isRunning, setIsRunning] = useState(timer.isRunning); 
  const intervalRef = useRef<number | null>(null); 
  const timerAudio = TimerAudio.getInstance(); 
  const hasEndedRef = useRef(false); 
  const [isMobile, setIsMobile] = useState(false); 

  // Handles resizing to determine if the view is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Timer countdown logic and end behavior
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1 && !hasEndedRef.current) {
            hasEndedRef.current = true; 
            timerAudio.playLoop(timer.id).catch(console.error); 
            
            // Displays toast notification when the timer ends
            toast.success(`Timer "${timer.title}" has ended!`, {
              duration: Infinity,
              position: isMobile ? 'bottom-center' : 'top-right',
              action: {
                label: "Dismiss",
                onClick: () => {
                  timerAudio.stop(timer.id); 
                },
              },
            });
            setIsRunning(false); 
            return 0;
          }
          return prevTime - 1; 
        });
      }, 1000);
    }

    // Cleanup interval on component unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timer.title, timer.id, timerAudio, isMobile]);

  // Synchronizes component state with the timer object
  useEffect(() => {
    setRemainingTime(timer.remainingTime);
    setIsRunning(timer.isRunning);
  }, [timer.remainingTime, timer.isRunning]);

  // Handles restarting the timer
  const handleRestart = () => {
    hasEndedRef.current = false; 
    setRemainingTime(timer.duration); 
    setIsRunning(false); 
    restartTimer(timer.id); 
    timerAudio.stop(timer.id); 
  };

  // Handles deleting the timer
  const handleDelete = () => {
    timerAudio.stop(timer.id); 
    deleteTimer(timer.id); 
  };

  // Handles toggling between start and pause
  const handleToggle = () => {
    if (remainingTime <= 0) {
      hasEndedRef.current = false;
      setRemainingTime(timer.duration); 
    }
    setIsRunning((prev) => !prev); 
  };

  // Calculates progress percentage for the timer
  const progress = Math.max(0, Math.min(100, (remainingTime / timer.duration) * 100));

  return (
    <>
      <div className="relative p-6 overflow-hidden transition-transform bg-white shadow-lg rounded-xl hover:scale-102">
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {timer.title}
              </h3>
              {timer.description && (
                <p className="mt-1 text-gray-600 break-words">
                  {timer.description} 
                </p>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="icon"
                onClick={() => setIsEditModalOpen(true)} 
                title="Edit Timer"
              >
                <Pencil className="w-5 h-5 text-blue-500" />
              </Button>
              <Button
                variant="icon"
                onClick={handleRestart} 
                title="Restart Timer"
              >
                <RotateCcw className="w-5 h-5 text-blue-500" />
              </Button>
              <Button
                variant="icon"
                onClick={handleDelete} 
                title="Delete Timer"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6">
            <div className="mb-4 font-mono text-4xl font-bold text-gray-800">
              {formatTime(remainingTime)} 
            </div>

            <TimerProgress progress={progress} /> 

            <TimerControls
              isRunning={isRunning}
              remainingTime={remainingTime}
              duration={timer.duration}
              onToggle={handleToggle} 
              onRestart={handleRestart} 
            />
          </div>
        </div>
      </div>

      <TimerModal
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        timer={timer} 
      />
    </>
  );
};
