import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/providers/store';
import { setTasks } from '../../../entities/task';
import { stopTimer } from '../../../entities/timer';
import { Text, Grid } from '@radix-ui/themes';
import Confetti from '../../../shared/ui/Confetti';
import styles from '../TaskList.module.css';
import { initDB, getAllTasks, syncTasks } from '../../../shared/lib/indexedDB';
import { useTaskManager } from '../../../features/taskManagement';
import { TaskItem } from './TaskItem';
import { formatDuration } from '../../../shared/lib/timeUtils';
import { Timer } from '../../../features/timerManagement';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, currentTask, handleStartTask, handleTaskStatus } = useTaskManager();
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
      <Timer />
      <Grid width="100%" columns="1fr 1fr 1fr" gap="3" className={styles.taskList}>
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            currentTaskId={currentTask?.id || null}
            onStartTask={handleStartTask}
            onCompleteTask={handleCompleteTask}
            onCloseTask={handleTaskStatus}
            formatDuration={formatDuration}
          />
        ))}
      </Grid>
      {showConfetti && <Confetti />}
    </>
  );
};

export default TaskList;