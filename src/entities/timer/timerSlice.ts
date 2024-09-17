import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimerState {
  isRunning: boolean;
  duration: number;
  remainingTime: number;
}

const initialState: TimerState = {
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
    },
    stopTimer: (state) => {
      state.isRunning = false;
      state.duration = 0;
      state.remainingTime = 0;
    },
    updateRemainingTime: (state, action: PayloadAction<number>) => {
      state.remainingTime = action.payload;
    },
  },
});

export const { startTimer, stopTimer, updateRemainingTime } = timerSlice.actions;
export default timerSlice.reducer;