import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@radix-ui/themes';
import { stopTimer } from '../model/stopTimer';
import { AppDispatch } from '../../../app/providers/store';

interface StopTimerButtonProps {
  disabled: boolean;
}

export const StopTimerButton: React.FC<StopTimerButtonProps> = ({ disabled }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleStop = () => {
    dispatch(stopTimer());
  };

  return (
    <Button onClick={handleStop} disabled={disabled}>
      Stop Timer
    </Button>
  );
};