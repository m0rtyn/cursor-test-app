import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/providers/store';
import { updateTaskStatus } from '../../entities/task/taskSlice';
import { stopTimer } from '../../entities/timer/timerSlice';
import { Task } from '../../entities/task/types';
import { Flex, Text, Button } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import Confetti from '../../shared/ui/Confetti';
import styles from './TaskList.module.css';

const TaskList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const currentTask = useSelector((state: RootState) => state.task.currentTask);
  const { isRunning, remainingTime, duration } = useSelector((state: RootState) => state.timer);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleTaskStatus = useCallback((id: string, status: 'completed' | 'failed') => {
    const actualDuration = currentTask?.duration ? currentTask.duration - remainingTime : 0;
    dispatch(updateTaskStatus({ id, status, actualDuration }));
    if (isRunning) {
      dispatch(stopTimer());
    }
    if (status === 'completed') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentTask, isRunning, remainingTime, dispatch]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Flex direction="column" gap="3" className={styles.taskList}>
      <Text size="5" weight="bold" className={styles.title}>Task List</Text>
      {tasks.map((task: Task) => (
        <Flex key={task.id} direction="column" gap="2" className={styles.taskItem}>
          <Text className={styles.taskName}>{task.name} - {task.status}</Text>
          {task.status !== 'pending' && (
            <Text size="2" color="gray" className={styles.taskDuration}>
              Duration: {formatDuration(task.actualDuration || task.duration)}
            </Text>
          )}
          {task.status === 'pending' && (
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
          )}
        </Flex>
      ))}
      {showConfetti && <Confetti />}
    </Flex>
  );
};

export default TaskList;