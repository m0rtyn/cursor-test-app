import { configureStore } from '@reduxjs/toolkit';
import { taskReducer, TaskState } from '../../entities/task';
import { timerReducer, TimerState } from '../../entities/timer';
import { loadFromLocalStorage } from '../../shared/lib/localStorage';

const preloadedState = {
  timer: loadFromLocalStorage('timerState') as TimerState,
  task: loadFromLocalStorage('taskState') as TaskState,
};

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    task: taskReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;