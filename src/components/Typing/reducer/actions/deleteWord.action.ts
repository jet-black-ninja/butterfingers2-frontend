import { TypingState } from '../typing.reducer';

export default function deleteWord(state: TypingState): TypingState {
  if (state.result.showResult) return state;

  const words = state.words.slice(0);

  const currentWord = words[state.wordIndex];
  const extraCharIndex = currentWord.chars.findIndex(
    char => char.type === 'extra'
  );
  if (extraCharIndex !== -1) {
    words[state.wordIndex].chars = currentWord.chars.slice(0, extraCharIndex);
  }

  const charIndex = Math.min(state.charIndex, currentWord.chars.length);

  let deleteWordCorrectChars = 0;

  for (let i = 0; i < charIndex; i++) {
    const char = currentWord.chars[i];
    if (char.type === 'correct') {
      deleteWordCorrectChars++;
    }
    char.type = 'none';
  }
  return {
    ...state,
    words,
    charIndex: 0,
    typedCorrectly: state.typedCorrectly - deleteWordCorrectChars,
  };
}
