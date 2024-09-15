import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@radix-ui/themes';
import { completeTask } from '../model/completeTask';
import { AppDispatch } from '../../../app/providers/store';

interface CompleteTaskButtonProps {
  taskId: string;
  actualDuration: number;
}

export const CompleteTaskButton: React.FC<CompleteTaskButtonProps> = ({ taskId, actualDuration }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleComplete = () => {
    dispatch(completeTask(taskId, actualDuration));
  };

  return (
    <Button onClick={handleComplete}>Yes, Completed</Button>
  );
};