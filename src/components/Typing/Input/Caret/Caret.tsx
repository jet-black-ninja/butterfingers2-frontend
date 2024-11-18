import { useContext, useEffect, useState } from 'react';
import styles from './Caret.module.scss';
import { TypingContext } from '@/contexts/typing.context';
import { ProfileContext } from '@/contexts/profile.context';

interface Props {
  lineHeight: number;
  wordIndex: number;
  charIndex: number;
  wordOffset: number;
  firstWord: boolean;
  wordRef: React.MutableRefObject<HTMLDivElement | undefined>;
  charRef: React.MutableRefObject<HTMLDivElement | undefined>;
  className?: string;
}

function Caret(props: Props) {
  const {
    lineHeight,
    wordIndex,
    charIndex,
    wordOffset,
    firstWord,
    wordRef,
    charRef,
    className,
  } = props;
  const { typingStarted } = useContext(TypingContext);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });
  const [charWidth, setCharWidth] = useState(0);
  const { profile } = useContext(ProfileContext);
  const { caretStyle, fontSize, smoothCaret } = profile.customize;
  useEffect(() => {
    if (!wordRef.current) return;
    const {
      offsetLeft: wordOffsetLeft,
      offsetTop: wordOffsetTop,
      offsetWidth: wordOffsetWidth,
    } = wordRef.current;
    if (!charRef.current) {
      return setCaretPos({
        x: wordOffsetLeft + wordOffsetWidth,
        y: wordOffsetTop - wordOffset,
      });
    }
    const { offsetLeft: charOffsetLeft } = charRef.current;
    setCaretPos({
      x: wordOffsetLeft + charOffsetLeft,
      y: wordOffsetTop - wordOffset,
    });
  }, [
    wordIndex,
    charIndex,
    wordOffset,
    firstWord,
    wordRef,
    charRef,
    lineHeight,
  ]);
  useEffect(() => {
    setCharWidth(charRef.current?.clientWidth || 0);
  }, [lineHeight]);
  const sizingStyle = (
    caretStyle === 'line'
      ? {
          width: charWidth / 9,
          height: lineHeight - fontSize * 0.4,
          left: 0,
          top: 1,
        }
      : caretStyle === 'underline'
        ? {
            width: charWidth,
            height: lineHeight / 30,
            left: 1,
            top: lineHeight - fontSize * 0.4 - 2,
          }
        : caretStyle === 'block'
          ? {
              width: charWidth,
              height: lineHeight * 0.6,
              left: 0,
              top: fontSize * 0.2,
            }
          : {}
  ) as React.CSSProperties;
  return (
    <div
      className={`${styles.caret} ${styles[`caret--${caretStyle}`]} ${smoothCaret && styles.smooth} ${!typingStarted ? (smoothCaret ? styles['blink-smooth'] : styles['blink']) : ''} ${className || ''}`}
      style={{
        transform: `translate(${caretPos.x}px, ${caretPos.y}px)`,
        ...sizingStyle,
      }}
    />
  );
}

export default Caret;
