import { AppDispatch } from '../../../app/providers/store';
import { resetTimer } from '../../../entities/timer/timerSlice';

export const stopTimer = () => (dispatch: AppDispatch) => {
  dispatch(resetTimer());
};