import { AppDispatch } from '../../../app/providers/store';
import { updateTaskStatus } from '../../../entities/task/taskSlice';
import { stopTimer } from '../../../entities/timer/timerSlice';

export const failTask = (id: string, actualDuration: number) => (dispatch: AppDispatch) => {
  dispatch(updateTaskStatus({ id, status: 'failed', actualDuration }));
  dispatch(stopTimer());
};