import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/providers/store';
import { updateRemainingTime, stopTimer } from '../../../entities/timer';
import { Text } from '@radix-ui/themes';
import { formatDuration } from '../../../shared/lib/timeUtils';

const Timer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isRunning, remainingTime } = useSelector((state: RootState) => state.timer);

  useEffect(() => {
    let interval: number;
    if (isRunning && remainingTime > 0) {
      interval = window.setInterval(() => {
        dispatch(updateRemainingTime(remainingTime - 1));
      }, 1000);
    } else if (isRunning && remainingTime === 0) {
      dispatch(stopTimer());
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingTime, dispatch]);

  return (
    <Text size="5" weight="bold">
      {isRunning ? formatDuration(remainingTime) : 'Timer not running'}
    </Text>
  );
};

export default Timer;