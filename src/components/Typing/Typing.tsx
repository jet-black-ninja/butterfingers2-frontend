import { ProfileContext } from '@/contexts/profile.context';
import { TypemodeContext } from '@/contexts/typemode.context';
import { TypingContext } from '@/contexts/typing.context';
import { useSound } from '@/hooks';
import { TypingResult } from '@/types';
import {
  PureComponent,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import typewriterSound from '@/assets/audio/typewriter.wav';
import typingReducer, { initialState } from './reducer/typing.reducer';
import { getRandomWords, getTypingWords } from '@/helpers';
import { getRandomQuoteByLength } from '@/services/quotable';
interface Props {
  testText?: string;
  secondCaret?: { wordIndex: number; charIndex: number };
  oneVersusOne?: boolean;
  typeModeCustom?: string;
  onCaretPositionChange?: (wordIndex: number, charIndex: number) => void;
  onResult?: (result: TypingResult) => void;
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
  /**
   * This callback function is called when the user restarts the typing test.
   */
  const onRestart = useCallback(() => {
    onTypingEnded();
    onUpdateTypingFocus(false);

    quoteAbortController?.abort();
    quoteAbortController = new AbortController();
    setIsLoading(false);
    setLoadingError(null);
    if (testText !== undefined) {
      if (!testText.trim().length) {
        setIsLoading(true);
      } else {
        dispatch({
          type: 'RESTART',
          payload: getTypingWords(testText.split(' ')),
        });
        setIsLoading(false);
      }
    }

    if (!oneVersusOne) {
      if (mode === 'time') {
        dispatch({
          type: 'RESTART',
          payload: getRandomWords(50, punctuation, numbers),
        });
        setTimeCountdown(time);
      } else if (mode === 'words') {
        dispatch({
          type: 'RESTART',
          payload: getRandomWords(words, punctuation, numbers),
        });
      } else {
        dispatch({
          type: 'RESTART',
          payload: [],
        });
        setIsLoading(true);

        const tags =
          quoteTagsMode === 'only selected' && quoteTags.length
            ? quoteTags.filter(tag => tag.isSelected).map(tag => tag.name)
            : undefined;
        getRandomQuoteByLength(quote, tags, quoteAbortController).then(data => {
          if (
            (data.statusCode && data.statusCode === 404) ||
            data.statusCode === 500
          ) {
            setLoadingError(data.statusCode);
            setIsLoading(false);
            return;
          }
          dispatch({
            type: 'NEW_WORDS',
            payload: {
              words: getTypingWords(
                data.content.replace(/-/g, '-').replace(/…/g, '...').split(' ')
              ),
              author: data.author,
            },
          });
          setIsLoading(false);
          setLoadingError(null);
        });
      }
    }
  }, [
    time,
    mode,
    words,
    quote,
    testText,
    oneVersusOne,
    numbers,
    punctuation,
    quoteTagsMode, 
  ]);
  /**
   * This function is called when the user attempts to redo the previous typing test.
   */
  const onRepeat = () => {
    onTypingEnded();
    onUpdateTypingFocus(false);
    dispatch({ type: 'RESTART' });
    if (mode === 'time') {
      setTimeCountdown(time);
    }
  };
  /**
   * Effect hook that checks if the typing game has reached its conclusion.
   *
   * This effect is triggered when the mode changes to 'time' and oneVersusOne is false.
   * It also checks if the current word is correct and updates the state accordingly.
   */
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
  /**
   *Effect hook tha check for the need of new words if not in versus mode
   *
   *  This effect is triggered when the all the available words are typed in timed mode
   */
  useEffect(() => {
    if (oneVersusOne) return;
    if (mode === 'time') {
      if ((state.wordIndex + 1) % 10 === 0) {
        dispatch({
          type: 'ADD_WORDS',
          payload: getRandomWords(10, punctuation, numbers),
        });
      }
    }
  }, [mode, state.wordIndex, oneVersusOne]);
  /**
   * Effect hook that checks for when restart is triggered and called the abort controller based on it.
   */
  useEffect(() => {
    onRestart();
    return () => {
      quoteAbortController?.abort();
    };
  }, [onRestart]);
  /**
   * Effect hook to check the time interval between tests and update the timeline accordingly
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (typingStarted) {
      interval = setInterval(() => {
        dispatch({ type: 'TIMELINE' });
        if (mode === 'time' && !oneVersusOne) {
          setTimeCountdown(prevState => prevState - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval!);
    }
    return () => clearInterval(interval);
  }, [typingStarted, mode, oneVersusOne]);

  /**
   * Effect hook to to show update on time over in time mode
   */
  useEffect(() => {
    if (timeCountdown === 0) {
      dispatch({ type: 'RESULT', payload: time });
      onUpdateTypingFocus(false);
    }
  }, [timeCountdown, time]);
  /**
   * Effect hook to handle result and update the typemode accordingly
   */
  useEffect(() => {
    if (state.result.showResult) {
      onTestsCompletedUpdate(state.result);
      if (onResult) {
        onResult(state.result);
        onTypingEnded();
      }
      setTypemodeVisible(false);
    } else {
      setTypemodeVisible(true);
    }
  }, [state.result.showResult]);
  /**
   * Effect hook to handle the caret position while typing
   */
  useEffect(() => {
    if (onCaretPositionChange) {
      onCaretPositionChange(state.wordIndex, state.charIndex);
    }
  }, [state.wordIndex, state.charIndex, onCaretPositionChange]);
  return <>Typing</>;
}
