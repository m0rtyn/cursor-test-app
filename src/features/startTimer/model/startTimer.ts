import { AppDispatch } from '../../../app/providers/store';
import { startTimer as startTimerAction } from '../../../entities/timer/timerSlice';
import { addTask, setCurrentTask } from '../../../entities/task/taskSlice';
import { Task } from '../../../entities/task/types';

export const startTimer = (taskName: string, duration: number) => (dispatch: AppDispatch) => {
  const newTask: Task = {
    id: Date.now().toString(),
    title: taskName || `Task ${Date.now()}`,
    actualDuration: 0,
    initialDuration: duration,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  dispatch(addTask(newTask));
  dispatch(setCurrentTask(newTask));
  dispatch(startTimerAction(duration));
};