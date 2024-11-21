import { getTypingResults, twoDecimals } from '@/helpers';
import { TypingState } from '../typing.reducer';
import { time } from 'console';

export default function result(state: TypingState): TypingState {
  if (
    state.result.timeline.length === 0 ||
    !state.dateTypingStarted ||
    state.result.showResult
  ) {
    return state;
  }
  const timeline = [...state.result.timeline];
  const currentDate = new Date();
  if (!time) {
    const timeTook = currentDate.getTime() - state.dateTypingStarted;
    timeline.push({
      second: twoDecimals(timeTook / 1000),
      ...getTypingResults(
        state.typed,
        state.typedCorrectly,
        state.mistype,
        timeTook
      ),
    });
  }
  return {
    ...state,
    result: {
      ...state.result,
      showResult: true,
      timeline,
      date: currentDate,
    },
  };
}
