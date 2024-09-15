import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/providers/store';
import { updateRemainingTime, stopTimer } from '../../entities/timer/timerSlice';
import { Text } from '@radix-ui/themes';

const Timer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isRunning, remainingTime } = useSelector((state: RootState) => state.timer);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        dispatch(updateRemainingTime(remainingTime - 1));
      }, 1000);
    } else if (isRunning && remainingTime === 0) {
      dispatch(stopTimer());
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingTime, dispatch]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Text size="5" weight="bold">
      {isRunning ? formatTime(remainingTime) : 'Timer not running'}
    </Text>
  );
};

export default Timer;