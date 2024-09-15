import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/providers/store';
import { updateRemainingTime, stopTimer } from '../../entities/timer/timerSlice';
import { StartTimerButton } from '../../features/startTimer/ui/StartTimerButton';
import { Select, Text, Flex, Progress, TextField } from '@radix-ui/themes';

const DURATION_OPTIONS = [
  { value: 15 * 60, label: '15 minutes' },
  { value: 25 * 60, label: '25 minutes' },
  { value: 30 * 60, label: '30 minutes' },
  { value: 45 * 60, label: '45 minutes' },
  { value: 60 * 60, label: '60 minutes' },
];

const TimerControl: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isRunning, remainingTime, duration } = useSelector((state: RootState) => state.timer);
  const [taskName, setTaskName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(25 * 60);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && remainingTime > 0) {
      interval = window.setInterval(() => {
        dispatch(updateRemainingTime(remainingTime - 1));
      }, 1000);
    } else if (remainingTime === 0 && isRunning) {
      dispatch(stopTimer());
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, remainingTime, dispatch]);

  const progress = isRunning ? ((duration - remainingTime) / duration) * 100 : 0;

  return (
    <Flex direction="column" gap="3">
      <TextField.Root
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"  
        size="3"
      />

      <Select.Root size="3" value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(Number(value))}>
        <Select.Trigger />
        <Select.Content>
          {DURATION_OPTIONS.map(option => (
            <Select.Item key={option.value} value={option.value.toString()}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <StartTimerButton taskName={taskName} duration={selectedDuration} disabled={isRunning} />
      
      {isRunning && (
        <Flex direction="column" gap="2">
          <Progress value={progress} />
          <Text>
            Time remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default TimerControl;