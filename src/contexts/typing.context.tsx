import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { TypingResult } from '@/types';
import { ResultOptions } from '@/components/Typing/Result';

interface Context {
  typingStarted: boolean;
  typingFocused: boolean;
  typingDisabled: boolean;
  resultPreview: { state: TypingResult; options: ResultOptions } | null;
  lineHeight: number;
  setLineHeight: Dispatch<SetStateAction<number>>;
  typemodeVisible: boolean;
  setTypemodeVisible: Dispatch<SetStateAction<boolean>>;
  onTypingStarted: () => void;
  onTypingEnded: () => void;
  onTypingDisable: () => void;
  onTypingAllow: () => void;
  onPreviewResult: (
    result: TypingResult | null,
    options?: ResultOptions
  ) => void;
  onUpdateTypingFocus: (bool: boolean) => void;
}

const initialState: Context = {
  typingStarted: false,
  typingFocused: false,
  typingDisabled: false,
  resultPreview: null,
  lineHeight: 0,
  typemodeVisible: true,
  setLineHeight: () => {},
  setTypemodeVisible: () => {},
  onTypingStarted: () => {},
  onTypingEnded: () => {},
  onTypingDisable: () => {},
  onTypingAllow: () => {},
  onPreviewResult: () => {},
  onUpdateTypingFocus: () => {},
};

const TypingContext = createContext<Context>(initialState);
interface Props {
  children: React.ReactNode;
}

const TypingContextProvider = ({ children }: Props) => {
  const [typingStarted, setTypingStarted] = useState(
    initialState.typingStarted
  );
  const [typingFocused, setTypingFocused] = useState(
    initialState.typingFocused
  );
  const [typingDisabled, setTypingDisabled] = useState(
    initialState.typingDisabled
  );
  const [resultPreview, setResultPreview] = useState(
    initialState.resultPreview
  );
  const [lineHeight, setLineHeight] = useState(initialState.lineHeight);
  const [typemodeVisible, setTypemodeVisible] = useState(
    initialState.typemodeVisible
  );
  const onTypingStarted = () => setTypingStarted(true);
  const onTypingEnded = () => setTypingStarted(false);

  const onTypingDisable = () => setTypingDisabled(true);
  const onTypingAllow = () => setTypingDisabled(false);

  const onPreviewResult: Context['onPreviewResult'] = (result, options) => {
    setResultPreview(result ? { state: result, options } : null);
  };

  const onUpdateTypingFocus: Context['onUpdateTypingFocus'] = bool => {
    setTypingFocused(bool);
  };

  useEffect(() => {
    if (typingFocused) {
      document.documentElement.style.cursor = 'none';
    } else {
      document.documentElement.style.cursor = 'auto';
    }
  }, [typingFocused]);
  useEffect(() => {
    if (resultPreview === null) {
      setTypemodeVisible(true);
    } else {
      setTypemodeVisible(false);
    }
  });
  return (
    <TypingContext.Provider
      value={{
        typingStarted,
        typingFocused,
        typingDisabled,
        resultPreview,
        lineHeight,
        typemodeVisible,
        setTypemodeVisible,
        onTypingStarted,
        onTypingEnded,
        onTypingDisable,
        onTypingAllow,
        onPreviewResult,
        onUpdateTypingFocus,
        setLineHeight,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};

export { TypingContext, TypingContextProvider };
