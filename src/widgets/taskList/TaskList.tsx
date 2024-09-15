import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/providers/store';
import { updateTaskStatus, setTasks, setCurrentTask } from '../../entities/task/taskSlice';
import { stopTimer, startTimer } from '../../entities/timer/timerSlice';
import { Task } from '../../entities/task/types';
import { Flex, Text, Button, Grid } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import Confetti from '../../shared/ui/Confetti';
import styles from './TaskList.module.css';
import { initDB, getAllTasks, updateTask, syncTasks } from '../../shared/lib/indexedDB';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const currentTask = useSelector((state: RootState) => state.task.currentTask);
  const { isRunning, remainingTime } = useSelector((state: RootState) => state.timer);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const initializeDB = async () => {
      await initDB();
      const localTasks = await getAllTasks();
      if (localTasks.length > 0) {
        dispatch(setTasks(localTasks));
      }
    };

    initializeDB();

    // Сбрасываем состояние таймера и текущей задачи при загрузке
    dispatch(stopTimer());
    dispatch(setCurrentTask(null));
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncTasks(tasks).then(() => {
        console.log('Tasks synced with server');
      }).catch(error => {
        console.error('Error syncing tasks:', error);
      });
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [tasks]);

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

    if (status === 'completed') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [dispatch, tasks, isRunning, remainingTime]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Сначала сортируем по статусу: 'pending' задачи идут первыми
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Затем сортируем по ID в обратном порядке (предполагая, что более новые задачи имеют больший ID)
    return b.id.localeCompare(a.id);
  });

  return (
    <>
      {!isOnline && (
        <Text color="red" className={styles.offlineWarning}>
          You are currently offline. Some features may be limited.
        </Text>
      )}
      
      <Text size="5" weight="bold" className={styles.title}>Task List</Text>
      <Grid width="100%" columns="1fr 1fr 1fr" gap="3" className={styles.taskList}>
        {sortedTasks.map((task: Task) => (
          <Flex width="100%" key={task.id} direction="column" gap="2" className={styles.taskItem}>
            <Text className={styles.taskName}>{task.name} - {task.status}</Text>

            {task.status !== 'pending' && (
              <Text size="2" color="gray" className={styles.taskDuration}>
                {formatDuration(task.actualDuration || 0)} / {formatDuration(task.initialDuration || task.duration)}
              </Text>
            )}

            {task.status === 'pending' && (
              <>
                {currentTask?.id === task.id ? (
                  <Flex gap="2">
                    <Button onClick={() => handleTaskStatus(task.id, 'completed')} className={styles.completeTaskButton}>
                      Complete Task
                    </Button>

                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <Button className={styles.closeTaskButton}>Close Task</Button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className={styles.dialogOverlay} />
                        <Dialog.Content className={styles.dialogContent}>
                          <Dialog.Title className={styles.dialogTitle}>Close Task</Dialog.Title>
                          <Dialog.Description className={styles.dialogDescription}>
                            Did you complete the task "{task.name}"?
                          </Dialog.Description>
                          <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close asChild>
                              <Button onClick={() => handleTaskStatus(task.id, 'completed')} className={styles.dialogButton}>Yes, Completed</Button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                              <Button onClick={() => handleTaskStatus(task.id, 'failed')} className={styles.dialogButton}>No, Failed</Button>
                            </Dialog.Close>
                          </Flex>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </Flex>
                ) : (
                  <Button onClick={() => handleStartTask(task)} className={styles.startTaskButton}>
                    Start Task
                  </Button>
                )}
              </>
            )}
          </Flex>
        ))}
      </Grid>
      {showConfetti && <Confetti />}
    </>
  );
};

export default TaskList;