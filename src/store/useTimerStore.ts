import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Timer } from "../types/timer";

// Function to load timers from localStorage
const loadTimersFromStorage = (): Timer[] => {
  try {
    const stored = localStorage.getItem('timers');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Function to load theme from localStorage
const loadThemeFromStorage = (): 'light' | 'dark' => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  try {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? (storedTheme as 'light' | 'dark') : (prefersDark ? 'dark' : 'light');
  } catch {
    return prefersDark ? 'dark' : 'light';
  }
};

// Define the initial state with themes
interface TimerState {
  timers: Timer[];
  theme: 'light' | 'dark';
}

const initialState: TimerState = {
  timers: loadTimersFromStorage(),
  theme: loadThemeFromStorage(),
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(
        (timer) => timer.id !== action.payload
      );
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find(
        (timer) => timer.id === action.payload.id
      );
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

// Save to localStorage
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem('timers', JSON.stringify(state.timers));
    localStorage.setItem('theme', state.theme);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
});

export { store };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  restartTimer,
  editTimer,
  toggleTheme,
} = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: TimerState) => state.timers);
  const theme = useSelector((state: TimerState) => state.theme);

  return {
    timers,
    theme,
    addTimer: (timer: Omit<Timer, "id" | "createdAt">) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
    toggleTheme: () => dispatch(toggleTheme()),
  };
};