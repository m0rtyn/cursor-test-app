import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/providers/store';
import { setTasks } from '../../entities/task/taskSlice';
import { stopTimer } from '../../entities/timer/timerSlice';
import { Flex, Text, Grid } from '@radix-ui/themes';
import Confetti from '../../shared/ui/Confetti';
import styles from './TaskList.module.css';
import { initDB, getAllTasks, syncTasks } from '../../shared/lib/indexedDB';
import { useTaskManager } from '../../entities/task/useTaskManager';
import { TaskItem } from './TaskItem';

const TaskList: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, currentTask, isRunning, handleStartTask, handleTaskStatus } = useTaskManager();

  useEffect(() => {
    const initializeDB = async () => {
      await initDB();
      const localTasks = await getAllTasks();
      if (localTasks.length > 0) {
        dispatch(setTasks(localTasks));
      }
    };

    initializeDB();

    dispatch(stopTimer());
    dispatch(setTasks([]));
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


  const handleCompleteTask = (id: string) => {
    handleTaskStatus(id, 'completed');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            currentTaskId={currentTask?.id || null}
            isRunning={isRunning}
            onStartTask={handleStartTask}
            onCompleteTask={handleCompleteTask}
            onCloseTask={handleTaskStatus}
          />
        ))}
      </Grid>

      {showConfetti && <Confetti />}
    </>
  );
};

export default TaskList;