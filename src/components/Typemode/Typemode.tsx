import { useContext, useMemo } from 'react';

import { TypemodeContext } from '@/contexts/typemode.context';
import { ModalContext } from '@/contexts/modalContext/modal.context';
import { TypemodeType } from '@/data/types';
import { data } from '@/data';
import Column, { ColumnProps } from './Column/Column';
import {
  IconNumbers,
  IconPunctuation,
  IconQuote,
  IconTags,
  IconTime,
  IconWords,
} from '@/assets/image';
import styles from './Typemode.module.scss';
interface Props {
  className?: string;
}
function Typemode({ className }: Props) {
  const {
    mode,
    time,
    quote,
    words,
    quoteTagsMode,
    punctuation,
    numbers,
    onMode,
    onTime,
    onWords,
    onQuote,
    onPunctuationToggle,
    onNumbersToggle,
  } = useContext(TypemodeContext);

  const { onOpenModal } = useContext(ModalContext);
  const typemodeKeys = Object.keys(data.typemode) as TypemodeType[];

  const colFirstButtons = useMemo<ColumnProps['buttons']>(() => {
    const active = [];
    if (punctuation) active.push('punctuation');
    if (numbers) active.push('numbers');
    return mode === 'words' || mode === 'time'
      ? [
          {
            Icon: IconPunctuation,
            text: 'punctuation',
            action: () => onPunctuationToggle(),
            active: punctuation,
          },
          {
            Icon: IconNumbers,
            text: 'numbers',
            action: () => onNumbersToggle(),
            active: numbers,
          },
        ]
      : [
          {
            Icon: IconTags,
            text: 'tags',
            action: () => onOpenModal({ modal: 'quoteTags' }),
            active: quoteTagsMode === 'only selected',
          },
        ];
  }, [mode, punctuation, numbers, quoteTagsMode]);

  const modeIcons = { time: IconTime, words: IconWords, quote: IconQuote };

  const colSecondButtons = useMemo<ColumnProps['buttons']>(() => {
    return typemodeKeys.map(modeLocal => ({
      Icon: modeIcons[modeLocal],
      text: modeLocal,
      action: () => onMode(modeLocal),
      active: modeLocal === mode,
    }));
  }, [mode]);

  const colThirdButtons = useMemo<ColumnProps['buttons']>(() => {
    return mode === 'time'
      ? data.typemode.time.map(timeLocal => ({
          text: timeLocal,
          action: () => onTime(timeLocal),
          active: timeLocal === time,
        }))
      : mode === 'words'
        ? data.typemode.words.map(wordsLocal => ({
            text: wordsLocal,
            action: () => onWords(wordsLocal),
            active: wordsLocal === words,
          }))
        : data.typemode.quote.map(quoteLocal => ({
            text: quoteLocal,
            action: () => onQuote(quoteLocal),
            active:
              quote === 'all' ? quoteLocal !== 'all' : quoteLocal === quote,
          }));
  }, [mode, time, words, quote]);
  return (
    <div className={`${styles.container} ${className}`}>
      <Column buttons={colFirstButtons} />
      {!!colFirstButtons.length && <div className={styles.splitBar} />}
      <Column buttons={colSecondButtons} />
      {!!colThirdButtons.length && <div className={styles.splitBar} />}
      <Column buttons={colThirdButtons} />
    </div>
  );
}

export default Typemode;
