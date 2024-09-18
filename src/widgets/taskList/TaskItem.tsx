import React from 'react';
import {
  Flex,
  Text,
  Button,
  Badge,
  Card
} from '@radix-ui/themes';
import { Task } from '../../entities/task/types';
import styles from './TaskList.module.css';

interface TaskItemProps {
  task: Task;
  currentTaskId: string | null;
  isRunning: boolean;
  onStartTask: (task: Task) => void;
  onCompleteTask: (id: string) => void;
  onCloseTask: (id: string, status: 'completed' | 'failed') => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  currentTaskId,
  isRunning,
  onStartTask,
  onCompleteTask,
  onCloseTask
}) => {
  return (
    <Card>
      <Flex width="100%" direction="column" gap="2">
        <Flex direction="row" justify="between" align="center">
          <Text className={styles.taskName}>{task.title}</Text>
          <Badge
            color={
              task.status === 'active'
                ? 'yellow'
                : task.status === 'completed'
                ? 'green'
                : 'red'
            }
          >
            {task.status}
          </Badge>
        </Flex>

        {task.status === 'completed' && (
          <Text size="2" color="gray" className={styles.taskDuration}>
            {formatDuration(task?.actualDuration || 0)} /{' '}
            {formatDuration(task?.initialDuration || 0)}
          </Text>
        )}

        {task.status === 'active' && (
          <>
            {currentTaskId === task.id ? (
              <Flex gap="2">
                <Button
                  onClick={() => onCompleteTask(task.id)}
                  className={styles.completeTaskButton}
                >
                  Complete Task
                </Button>

                <Button
                  onClick={() => onCloseTask(task.id, 'failed')}
                  className={styles.closeTaskButton}
                >
                  Fail Task
                </Button>
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
    </Card>
  );
};

function formatDuration(seconds: number): string {
  if (seconds === 0) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
