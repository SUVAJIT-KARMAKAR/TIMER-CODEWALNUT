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

// Define the initial state for the timer slice.
const initialState = {
  timers: loadTimersFromStorage() as Timer[], 
};

// Create a slice for timer-related state and actions.
const timerSlice = createSlice({
  name: "timer", 
  initialState, 
  reducers: {
    // Action to add a new timer.
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload, 
        id: crypto.randomUUID(), 
        createdAt: Date.now(), 
      });
    },
    // Action to delete a timer by ID.
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter(
        (timer) => timer.id !== action.payload 
      );
    },
    // Action to toggle the running state of a timer.
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning; 
      }
    },
    // Action to restart a timer to its initial duration.
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration; 
        timer.isRunning = false; 
      }
    },
    // Action to edit a timer's details.
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
  },
});

// Configure the Redux store with the timer slice reducer.
const store = configureStore({
  reducer: timerSlice.reducer,
});

// Subscribe to store updates to save timers to localStorage.
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem('timers', JSON.stringify(state.timers)); 
  } catch (error) {
    console.error('Failed to save timers to localStorage:', error); 
  }
});

export { store };

// Export actions from the timer slice for use in components.
export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  restartTimer,
  editTimer,
} = timerSlice.actions;

// Custom hook to access the timer store and actions.
export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers); 

  return {
    timers,
    addTimer: (timer: Omit<Timer, "id" | "createdAt">) => dispatch(addTimer(timer)), 
    deleteTimer: (id: string) => dispatch(deleteTimer(id)), 
    toggleTimer: (id: string) => dispatch(toggleTimer(id)), 
    restartTimer: (id: string) => dispatch(restartTimer(id)), 
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })), 
  };
};
