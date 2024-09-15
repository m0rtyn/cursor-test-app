import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveToLocalStorage, loadFromLocalStorage } from '../../shared/lib/localStorage';

export interface TimerState {
  isRunning: boolean;
  duration: number;
  remainingTime: number;
}

const initialState: TimerState = loadFromLocalStorage('timerState') || {
  isRunning: false,
  duration: 0,
  remainingTime: 0,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<number>) => {
      state.isRunning = true;
      state.duration = action.payload;
      state.remainingTime = action.payload;
      saveToLocalStorage('timerState', state);
    },
    stopTimer: (state) => {
      state.isRunning = false;
      saveToLocalStorage('timerState', state);
    },
    updateRemainingTime: (state, action: PayloadAction<number>) => {
      state.remainingTime = action.payload;
      saveToLocalStorage('timerState', state);
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.duration = 0;
      state.remainingTime = 0;
      saveToLocalStorage('timerState', state);
    },
  },
});

export const { startTimer, stopTimer, updateRemainingTime, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;