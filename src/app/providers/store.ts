import { configureStore } from '@reduxjs/toolkit';
import timerReducer from '../../entities/timer/timerSlice';
import taskReducer from '../../entities/task/taskSlice';
import { loadFromLocalStorage } from '../../shared/lib/localStorage';

const preloadedState = {
  timer: loadFromLocalStorage('timerState'),
  task: loadFromLocalStorage('taskState'),
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