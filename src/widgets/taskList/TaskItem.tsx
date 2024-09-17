import React from 'react';
import { Flex, Text, Button, Badge } from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import { Task } from '../../entities/task/types';
import styles from './TaskList.module.css';

interface TaskItemProps {
  task: Task;
  currentTaskId: string | null;
  isRunning: boolean;
  onStartTask: (task: Task) => void;
  onCompleteTask: (id: string) => void;
  onCloseTask: (id: string, status: 'completed') => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  currentTaskId,
  isRunning,
  onStartTask,
  onCompleteTask,
  onCloseTask,
}) => {
  return (
    <Flex width="100%" direction="column" gap="2" className={styles.taskItem}>
      <Flex direction="row" justify="between" align="center">
        <Text className={styles.taskName}>{task.title}</Text>
        <Badge
          color={task.status === 'active' ? 'yellow' : 'completed' ? 'green' : 'red'}
        >
          {task.status}
        </Badge>
      </Flex>
      
      {task.status === 'completed' && (
        <Text size="2" color="gray" className={styles.taskDuration}>
          {formatDuration(task?.actualDuration || 0)} / {formatDuration(task?.initialDuration || 0)}
        </Text>
      )}

      {task.status === 'active' && (
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
                      Are you sure you want to complete the task "{task.title}"?
                    </Dialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close asChild>
                        <Button onClick={() => onCloseTask(task.id, 'completed')} className={styles.dialogButton}>
                          Yes, Complete
                        </Button>
                      </Dialog.Close>
                      <Dialog.Close asChild>
                        <Button className={styles.dialogButton}>Cancel</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </Flex>
          ) : (
            <Button 
              onClick={() => onStartTask(task)} 
              className={styles.startTaskButton}
              disabled={isRunning && currentTaskId !== task.id}
            >
              Start Task
            </Button>
          )}
        </>
      )}
    </Flex>
  );
};

function formatDuration(seconds: number): string {
  if (seconds === 0) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}