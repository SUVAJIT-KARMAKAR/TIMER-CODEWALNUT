import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { useTimerStore } from "../../store/useTimerStore";
import { validateTimerForm } from "../../utils/validation";
import { Timer } from "../../types/timer";
import { Button } from "../Button/Button";
import { toast, ToasterProps } from "sonner";

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer;
}

const MOBILE_BREAKPOINT = 768;

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timer,
}) => {
  const { theme } = useTimerStore();
  const isEditMode = !!timer;

  // State variables (unchanged)
  const [title, setTitle] = useState(timer?.title || "");
  const [description, setDescription] = useState(timer?.description || "");
  const [hours, setHours] = useState(
    timer ? Math.floor(timer.duration / 3600) : 0
  );
  const [minutes, setMinutes] = useState(
    timer ? Math.floor((timer.duration % 3600) / 60) : 0
  );
  const [seconds, setSeconds] = useState(timer ? timer.duration % 60 : 0);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });
  const [toastPosition, setToastPosition] =
    useState<ToasterProps["position"]>("top-right");

  const { addTimer, editTimer } = useTimerStore();

  // Theme-aware styles
  const modalStyles = {
    overlay:
      theme === "dark"
        ? "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
        : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
    container:
      theme === "dark"
        ? "bg-gray-800 text-white rounded-lg p-6 w-full max-w-md shadow-xl"
        : "bg-white text-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl",
    label: theme === "dark" ? "text-gray-200" : "text-gray-700",
    subLabel: theme === "dark" ? "text-gray-400" : "text-gray-600",
    input:
      theme === "dark"
        ? "bg-gray-700 border-2 border-gray-600 text-white rounded-md focus:border-blue-500 focus:ring-blue-500"
        : "bg-white border-2 border-gray-200 text-gray-900 rounded-md focus:border-blue-500 focus:ring-blue-500",
    errorInput:
      theme === "dark"
        ? "border-red-500 bg-gray-700"
        : "border-red-500 bg-white",
    divider: theme === "dark" ? "border-gray-700" : "border-gray-200",
    charCount: theme === "dark" ? "text-gray-400" : "text-gray-500",
  };

  // Existing useEffects and handlers remain unchanged
  useEffect(() => {
    const handleResize = () => {
      setToastPosition(
        window.innerWidth < MOBILE_BREAKPOINT ? "bottom-center" : "top-right"
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && timer) {
      setTitle(timer.title);
      setDescription(timer.description);
      setHours(Math.floor(timer.duration / 3600));
      setMinutes(Math.floor((timer.duration % 3600) / 60));
      setSeconds(timer.duration % 60);
    } else if (isOpen) {
      setTitle("");
      setDescription("");
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
    setTouched({
      title: false,
      hours: false,
      minutes: false,
      seconds: false,
    });
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const showError = (message: string) => {
    toast.error(message, {
      position: toastPosition,
    });
  };

  // Existing handlers remain unchanged
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      hours: true,
      minutes: true,
      seconds: true,
    });

    const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
    const isTitleValid = title.trim().length > 0 && title.length <= 50;

    if (!isTitleValid || !isTimeValid) {
      if (!isTitleValid)
        showError("Please enter a valid title (1-50 characters)");
      if (!isTimeValid) showError("Please set a duration greater than 0");
      return;
    }

    if (!validateTimerForm({ title, description, hours, minutes, seconds })) {
      showError("Please check all fields and try again");
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (isEditMode && timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: false,
      });
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
    setTouched({
      title: false,
      hours: false,
      minutes: false,
      seconds: false,
    });
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock
              className={
                theme === "dark"
                  ? "w-5 h-5 text-blue-400"
                  : "w-5 h-5 text-blue-600"
              }
            />
            <h2 className="text-xl font-semibold">
              {isEditMode ? "Edit Timer" : "Add New Timer"}
            </h2>
          </div>
          <Button variant="secondary" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className={`block text-sm font-semibold ${modalStyles.label} mb-1`}
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched({ ...touched, title: true })}
              maxLength={50}
              className={`w-full px-3 py-2 ${modalStyles.input} ${
                touched.title && !isTitleValid ? modalStyles.errorInput : ""
              }`}
              placeholder="Enter timer title"
            />
            {touched.title && !isTitleValid && (
              <p className="mt-1 text-sm text-red-500">
                Title is required and must be less than 50 characters
              </p>
            )}
            <p className={`mt-1 text-sm ${modalStyles.charCount}`}>
              {title.length}/50 characters
            </p>
          </div>

          <div>
            <label
              className={`block text-sm font-semibold ${modalStyles.label} mb-1`}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 ${modalStyles.input}`}
              placeholder="Enter timer description (optional)"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-semibold ${modalStyles.label} mb-3`}
            >
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["Hours", "Minutes", "Seconds"].map((label, index) => (
                <div key={label}>
                  <label
                    className={`block text-sm ${modalStyles.subLabel} mb-1`}
                  >
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={index === 0 ? "23" : "59"}
                    value={
                      index === 0 ? hours : index === 1 ? minutes : seconds
                    }
                    onChange={(e) => {
                      const value = Math.min(
                        index === 0 ? 23 : 59,
                        parseInt(e.target.value) || 0
                      );
                      if (index === 0) setHours(value);
                      else if (index === 1) setMinutes(value);
                      else setSeconds(value);
                    }}
                    onBlur={() =>
                      setTouched({
                        ...touched,
                        [index === 0
                          ? "hours"
                          : index === 1
                          ? "minutes"
                          : "seconds"]: true,
                      })
                    }
                    className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 ${modalStyles.input}`}
                  />
                </div>
              ))}
            </div>
            {touched.hours &&
              touched.minutes &&
              touched.seconds &&
              !isTimeValid && (
                <p className="mt-2 text-sm text-red-500">
                  Please set a duration greater than 0
                </p>
              )}
          </div>

          <div
            className={`flex justify-end gap-3 pt-4 border-t ${modalStyles.divider}`}
          >
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? "Save Changes" : "Add Timer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
