import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState } from './types';
import { saveToLocalStorage, loadFromLocalStorage } from '../../shared/lib/localStorage';

const initialState: TaskState = loadFromLocalStorage('taskState') || {
  tasks: [],
  currentTask: null,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      saveToLocalStorage('taskState', state);
    },
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
      saveToLocalStorage('taskState', state);
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: 'completed' | 'failed'; actualDuration: number }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.actualDuration = action.payload.actualDuration;
      }
      state.currentTask = null;
      saveToLocalStorage('taskState', state);
    },
  },
});

export const { addTask, setCurrentTask, updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;