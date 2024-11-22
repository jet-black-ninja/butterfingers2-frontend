import { ProfileContext } from '@/contexts/profile.context';
import { TypemodeContext } from '@/contexts/typemode.context';
import { TypingContext } from '@/contexts/typing.context';
import { useSound } from '@/hooks';
import { TypingResult } from '@/types';
import { useContext, useEffect, useState } from 'react';
import typewriterSound from '@/assets/audio/typewriter.wav';
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
    }
    if (typingFocused) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [typingFocused]);

  
  return <>Typing</>;
}
