import React from 'react';
import { Flex, Text, Button } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import { Task } from '../../entities/task/types';
import styles from './TaskList.module.css';

interface TaskItemProps {
  task: Task;
  currentTaskId: string | null;
  isRunning: boolean;
  onStartTask: (task: Task) => void;
  onCompleteTask: (id: string) => void;
  onCloseTask: (id: string, status: 'completed' | 'failed') => void;
  formatDuration: (seconds: number) => string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  currentTaskId,
  isRunning,
  onStartTask,
  onCompleteTask,
  onCloseTask,
  formatDuration,
}) => {
  return (
    <Flex width="100%" direction="column" gap="2" className={styles.taskItem}>
      <Text className={styles.taskName}>{task.name} - {task.status}</Text>
      {task.status !== 'pending' && (
        <Text size="2" color="gray" className={styles.taskDuration}>
          {formatDuration(task.actualDuration || 0)} / {formatDuration(task.initialDuration || task.duration)}
        </Text>
      )}
      {task.status === 'pending' && (
        <>
          {currentTaskId === task.id ? (
            <Flex gap="2">
              <Button onClick={() => onCompleteTask(task.id)} className={styles.completeTaskButton}>
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
                        <Button onClick={() => onCloseTask(task.id, 'completed')} className={styles.dialogButton}>Yes, Completed</Button>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <Button onClick={() => onCloseTask(task.id, 'failed')} className={styles.dialogButton}>No, Failed</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </Flex>
          ) : (
            <Button onClick={() => onStartTask(task)} className={styles.startTaskButton}>
              Start Task
            </Button>
          )}
        </>
      )}
    </Flex>
  );
};