import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/providers/store';
import { updateTaskStatus, setCurrentTask } from './taskSlice';
import { stopTimer, startTimer } from '../timer/timerSlice';
import { Task } from './types';
import { updateTask } from '../../shared/lib/indexedDB';

export const useTaskManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const currentTask = useSelector((state: RootState) => state.task.currentTask);
  const { isRunning, remainingTime } = useSelector((state: RootState) => state.timer);

  const handleStartTask = useCallback((task: Task) => {
    const updatedTask: Task = {
      ...task,
      status: 'active',
      actualDuration: task.actualDuration || 0,
      initialDuration: task.initialDuration || 0
    };
    dispatch(setCurrentTask(updatedTask));
    dispatch(startTimer(updatedTask.initialDuration));
  }, [dispatch]);

  const handleTaskStatus = useCallback(async (id: string, status: 'completed' | 'active' | 'failed') => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const actualDuration = task?.actualDuration || 0 + (isRunning ? task.initialDuration - remainingTime : 0);
    const updatedTask: Task = { ...task, status, actualDuration };
    
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