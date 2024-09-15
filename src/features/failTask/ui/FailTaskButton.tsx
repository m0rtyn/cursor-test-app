import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@radix-ui/themes';
import { failTask } from '../model/failTask';
import { AppDispatch } from '../../../app/providers/store';

interface FailTaskButtonProps {
  taskId: string;
  actualDuration: number;
}

export const FailTaskButton: React.FC<FailTaskButtonProps> = ({ taskId, actualDuration }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleFail = () => {
    dispatch(failTask(taskId, actualDuration));
  };

  return (
    <Button onClick={handleFail}>No, Failed</Button>
  );
};