import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/providers/store';
import { updateTaskStatus, setCurrentTask, Task } from '../../../entities/task';
import { stopTimer, startTimer } from '../../../entities/timer';
import { updateTask } from '../../../shared/lib/indexedDB';

export const useTaskManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const currentTask = useSelector((state: RootState) => state.task.currentTask);
  const { isRunning, remainingTime } = useSelector((state: RootState) => state.timer);

  const handleStartTask = useCallback((task: Task) => {
    dispatch(setCurrentTask(task));
    dispatch(startTimer(task.duration));
    console.log('Starting task:', task.name, 'Duration:', task.duration);
  }, [dispatch]);

  const handleTaskStatus = useCallback(async (id: string, status: 'completed' | 'failed') => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const actualDuration = isRunning ? task.duration - remainingTime : 0;
    const initialDuration = task.duration;
    const updatedTask = { ...task, status, actualDuration, initialDuration };
    
    dispatch(updateTaskStatus(updatedTask));
    dispatch(stopTimer());
    dispatch(setCurrentTask(null));
    
    try {
      await updateTask(updatedTask);
    } catch (error) {
      console.error('Error updating task in IndexedDB:', error);
    }
  }, [dispatch, tasks, isRunning, remainingTime]);

  return {
    tasks,
    currentTask,
    isRunning,
    handleStartTask,
    handleTaskStatus,
  };
};