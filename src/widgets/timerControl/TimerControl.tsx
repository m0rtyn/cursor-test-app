import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/providers/store';
import { startTimer, stopTimer, updateRemainingTime } from '../../entities/timer/timerSlice';
import { addTask, setCurrentTask } from '../../entities/task/taskSlice';
import { Task } from '../../entities/task/types';
import { Button, Select, Text, Flex } from '@radix-ui/themes';

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

  const handleTimerEnd = useCallback(() => {
    dispatch(stopTimer());
    // TODO: Implement notification logic here
  }, [dispatch]);

  useEffect(() => {
    let interval: number;
    if (isRunning && remainingTime > 0) {
      interval = window.setInterval(() => {
        dispatch(updateRemainingTime(remainingTime - 1));
      }, 1000);
    } else if (remainingTime === 0 && isRunning) {
      handleTimerEnd();
    }
    return () => window.clearInterval(interval);
  }, [isRunning, remainingTime, dispatch, handleTimerEnd]);

  const handleStart = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName || `Task ${Date.now()}`,
      duration: selectedDuration,
      status: 'pending',
    };
    dispatch(addTask(newTask));
    dispatch(setCurrentTask(newTask));
    dispatch(startTimer(selectedDuration));
  };

  const progress = isRunning ? ((duration - remainingTime) / duration) * 100 : 0;

  return (
    <Flex direction="column" gap="3">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Task name"
      />
      <Select.Root value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(Number(value))}>
        <Select.Trigger />
        <Select.Content>
          {DURATION_OPTIONS.map(option => (
            <Select.Item key={option.value} value={option.value.toString()}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Button onClick={handleStart} disabled={isRunning}>
        Start Timer
      </Button>
      {isRunning && (
        <Flex direction="column" gap="2">
          <progress value={progress} max="100" />
          <Text>
            Time remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default TimerControl;