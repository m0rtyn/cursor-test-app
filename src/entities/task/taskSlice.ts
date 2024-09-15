import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from './types';
import { saveToLocalStorage } from '../../shared/lib/localStorage';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
}

const initialState: TaskState = {
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
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: 'completed' | 'failed'; actualDuration: number; initialDuration: number }>) => {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.actualDuration = action.payload.actualDuration;
        task.initialDuration = action.payload.initialDuration;
      }
      state.currentTask = null;
      saveToLocalStorage('taskState', state);
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { addTask, updateTaskStatus, setCurrentTask, setTasks } = taskSlice.actions;
export default taskSlice.reducer;