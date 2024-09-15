import { configureStore } from '@reduxjs/toolkit';
import timerReducer from '../../entities/timer/timerSlice';
import taskReducer from '../../entities/task/taskSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;