import { createContext, ReactNode, useEffect, useState } from 'react';
import { getQuoteTagList } from '@/services/quotable';
import { QuoteLengthType } from '@/types';
import { useLocalStorageState } from '@/hooks';
import { TypemodeTime, TypemodeType, TypemodeWords } from '@/data/types';

type QuoteTagsType = { name: string; isSelected: boolean }[];
type QuoteTagsModeType = 'all' | 'only selected';
interface Context {
  mode: TypemodeType;
  time: TypemodeTime;
  words: TypemodeWords;
  quote: QuoteLengthType;
  punctuation: boolean;
  numbers: boolean;
  quoteTagsMode: QuoteTagsModeType;
  quoteTags: QuoteTagsType;
  onMode: (mode: TypemodeType) => void;
  onTime: (time: TypemodeTime) => void;
  onWords: (words: TypemodeWords) => void;
  onQuote: (quote: QuoteLengthType) => void;
  onPunctuationToggle: () => void;
  onNumbersToggle: () => void;
  onToggleQuoteTag: (index: number) => void;
  onUpdateQuoteTagsMode: (mode: QuoteTagsModeType) => void;
  onClearSelectedQuoteTags: () => void;
}
const initialState: Context = {
  mode: 'quote',
  time: 15,
  words: 10,
  quote: 'short',
  punctuation: false,
  numbers: false,
  quoteTagsMode: 'all',
  quoteTags: [],
  onMode: () => {},
  onTime: () => {},
  onWords: () => {},
  onQuote: () => {},
  onPunctuationToggle: () => {},
  onNumbersToggle: () => {},
  onToggleQuoteTag: () => {},
  onUpdateQuoteTagsMode: () => {},
  onClearSelectedQuoteTags: () => {},
};
export const TypemodeContext = createContext(initialState);

interface Props {
  children: React.ReactNode;
}

export const TypemodeContextProvider = ({ children }: Props) => {
  const [mode, setMode] = useLocalStorageState(
    'typing-mode',
    initialState.mode
  );
  const [time, setTime] = useLocalStorageState(
    'typing-time',
    initialState.time
  );
  const [words, setWords] = useLocalStorageState(
    'typing-words',
    initialState.words
  );
  const [quote, setQuote] = useLocalStorageState(
    'typing-quote',
    initialState.quote
  );
  const [punctuation, setPunctuation] = useLocalStorageState(
    'typing-punctuation',
    initialState.punctuation
  );
  const [numbers, setNumbers] = useLocalStorageState(
    'numbers',
    initialState.numbers
  );
  const [quoteTags, setQuoteTags] = useState(initialState.quoteTags);
  const [quoteTagsMode, setQuoteTagsMode] = useState(
    initialState.quoteTagsMode
  );
  useEffect(() => {
    getQuoteTagList().then(data => {
      const quoteTagsData: QuoteTagsType = data.map((tag: any) => ({
        name: tag.name,
        isSelected: false,
      }));
      setQuoteTags(quoteTagsData);
    });
  }, []);
  const onMode: Context['onMode'] = mode => {
    setMode(mode);
  };
  const onTime: Context['onTime'] = time => {
    setTime(time);
  };
  const onWords: Context['onWords'] = words => {
    setWords(words);
  };
  const onQuote: Context['onQuote'] = quote => {
    setQuote(quote);
  };
  const onPunctuationToggle: Context['onPunctuationToggle'] = () => {
    setPunctuation(state => !state);
  };
  const onNumbersToggle: Context['onNumbersToggle'] = () => {
    setNumbers(state => !state);
  };
  const onToggleQuoteTag: Context['onToggleQuoteTag'] = tagIndex => {
    setQuoteTags(state => [
      ...state.slice(0, tagIndex),
      {
        name: state[tagIndex].name,
        isSelected: !state[tagIndex].isSelected,
      },
      ...state.slice(tagIndex + 1),
    ]);
  };
  const onUpdateQuoteTagsMode: Context['onUpdateQuoteTagsMode'] = mode => {
    setQuoteTagsMode(mode);
  };

  const onClearSelectedQuoteTags: Context['onClearSelectedQuoteTags'] = () => {
    setQuoteTags(state =>
      state.map(quoteTag => ({ ...quoteTag, isSelected: false }))
    );
  };
  return (
    <TypemodeContext.Provider
      value={{
        mode,
        time,
        words,
        quote,
        punctuation,
        numbers,
        quoteTagsMode,
        quoteTags,
        onMode,
        onTime,
        onWords,
        onQuote,
        onPunctuationToggle,
        onNumbersToggle,
        onToggleQuoteTag,
        onUpdateQuoteTagsMode,
        onClearSelectedQuoteTags,
      }}
    >
      {children}
    </TypemodeContext.Provider>
  );
};
