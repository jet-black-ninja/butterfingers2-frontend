import { ProfileContext } from '@/contexts/profile.context';
import { TypemodeContext } from '@/contexts/typemode.context';
import { TypingContext } from '@/contexts/typing.context';
import { useSound } from '@/hooks';
import { TypingResult } from '@/types';
import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import typewriterSound from '@/assets/audio/typewriter.wav';
import typingReducer, { initialState } from './reducer/typing.reducer';
interface Props {
  testText?: string;
  secondCaret?: { wordIndex: number; charIndex: number };
  oneVersusOne?: boolean;
  typeModeCustom?: string;
  onCaretPositionChange?: (wordIndex: number, charIndex: number) => void;
  onResult: (result: TypingResult) => void;
}
//used to abort previous fetch call if new one is called
let quoteAbortController: AbortController | null = null;
export default function Typing(props: Props) {
  const {
    testText,
    secondCaret,
    oneVersusOne,
    typeModeCustom,
    onCaretPositionChange,
    onResult,
  } = props;

  const {
    typingDisabled,
    typingStarted,
    typingFocused,
    onUpdateTypingFocus,
    onTypingStarted,
    onTypingEnded,
    setTypemodeVisible,
  } = useContext(TypingContext);

  const [state, dispatch] = useReducer(typingReducer, initialState);
  const {
    mode,
    words,
    time,
    quote,
    numbers,
    punctuation,
    quoteTags,
    quoteTagsMode,
  } = useContext(TypemodeContext);

  const { profile, onTestsStartedUpdate, onTestsCompletedUpdate } =
    useContext(ProfileContext);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [timeCountdown, setTimeCountdown] = useState<number>(time);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<404 | 500 | null>(null);
  const playTypingSound = useSound(typewriterSound, 0.3);

  const isTypingDisabled =
    typingDisabled ||
    isLoading ||
    loadingError ||
    (oneVersusOne && !typingStarted);

  useEffect(() => {
    const handleMouseMove = () => {
      onUpdateTypingFocus(false);
    };
    if (typingFocused) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [typingFocused]);

  useEffect(() => {
    const typeHandler = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === 'Escape') {
        onUpdateTypingFocus(false);
      }
      if (event.getModifierState && event.getModifierState('CapsLock')) {
        setIsCapsLockOn(true);
      } else {
        false;
      }

      if (event.ctrlKey && key === 'Backspace') {
        onUpdateTypingFocus(true);
        if (profile.customize.soundOnClick) playTypingSound();
        return dispatch({ type: 'DELETE_WORD' });
      }

      if (key === 'Backspace') {
        onUpdateTypingFocus(false);
        if (profile.customize.soundOnClick) playTypingSound();
        return dispatch({ type: 'DELETE_KEY' });
      }

      if (key === ' ') {
        event.preventDefault();
        onUpdateTypingFocus(false);
        if (profile.customize.soundOnClick) playTypingSound();
        return dispatch({ type: 'NEXT_WORD' });
      }

      if (key.length === 1) {
        if (!typingStarted && !oneVersusOne) {
          onTypingStarted();
        }
        onUpdateTypingFocus(true);
        if (profile.customize.soundOnClick) playTypingSound();
        return dispatch({ type: 'TYPE', payload: key });
      }

      if (state.result.showResult || isTypingDisabled) {
        document.removeEventListener('keydown', typeHandler);
      } else {
        document.addEventListener('keydown', typeHandler);
      }
      return () => document.removeEventListener('keydown', typeHandler);
    };
  }, [
    typingStarted,
    onTypingStarted,
    state.result.showResult,
    mode,
    quote,
    time,
    words,
    isTypingDisabled,
    playTypingSound,
    profile.customize.soundOnClick,
    oneVersusOne,
  ]);
  useEffect(() => {
    if (typingStarted) {
      if (profile.username) {
        onTestsStartedUpdate();
      }
      dispatch({
        type: 'START',
        payload:
          typeModeCustom ||
          `${mode} ${mode === 'time' ? time : mode === 'words' ? words : quote}`,
      });
    }
  }, [typingStarted]);

  const onRestart = useCallback(() => {}, []);
  const onRepeat = () => {
    onTypingEnded();
    onUpdateTypingFocus(false);
    dispatch({ type: 'RESTART' });
    if (mode === 'time') {
      setTimeCountdown(time);
    }
  };
  useEffect(() => {
    if (!state.words.length || (mode === 'time' && !oneVersusOne)) return;
    const lastWordCorrect =
      state.wordIndex === state.words.length - 1 &&
      state.words[state.wordIndex].chars.every(char => char.type === 'correct');
    if (state.wordIndex === state.words.length || lastWordCorrect) {
      dispatch({ type: 'RESULT' });
      onUpdateTypingFocus(false);
    }
  }, [mode, state.words, state.charIndex, state.wordIndex, oneVersusOne]);
  return <>Typing</>;
}
