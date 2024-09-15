import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@radix-ui/themes';
import { startTimer } from '../model/startTimer';
import { AppDispatch } from '../../../app/providers/store';

interface StartTimerButtonProps {
  taskName: string;
  duration: number;
  disabled: boolean;
}

export const StartTimerButton: React.FC<StartTimerButtonProps> = ({ taskName, duration, disabled }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleStart = () => {
    dispatch(startTimer(taskName, duration));
  };

  return (
    <Button onClick={handleStart} disabled={disabled}>
      Start Timer
    </Button>
  );
};