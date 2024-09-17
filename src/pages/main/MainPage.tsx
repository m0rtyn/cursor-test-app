import React from 'react';
import TimerControl from '../../widgets/timerControl/TimerControl';
import TaskList from '../../widgets/taskList/TaskList';
import { Flex, Heading } from '@radix-ui/themes';

const MainPage: React.FC = () => {
  return (
    <Flex direction="column" gap="4" p="4">
      <Heading size="8" align="center">Matodoro Timer</Heading>
      <TimerControl />
      <TaskList />
    </Flex>
  );
};

export default MainPage;