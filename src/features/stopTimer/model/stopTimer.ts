import { AppDispatch } from '../../../app/providers/store';
import { stopTimer as stopTimerAction } from '../../../entities/timer/timerSlice';

export const stopTimer = () => (dispatch: AppDispatch) => {
  dispatch(stopTimerAction());
};