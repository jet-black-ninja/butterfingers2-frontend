import { TypingWords } from '../../types';
import { TypingState } from '../typing.reducer';

export default function addWords(
  state: TypingState,
  words: TypingWords
): TypingState {
  if (state.result.showResult) return state;

  return {
    ...state,
    words: [...state.words, ...words],
  };
}
