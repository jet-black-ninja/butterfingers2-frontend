import { useContext, useMemo } from 'react';
import styles from './Typemode.modules.scss';
import { TypemodeContext } from '@/contexts/typemode.context';
import {
  ModalContext,
  ModalContextType,
} from '@/contexts/modalContext/modal.context';
import { TypemodeType } from '@/data/types';
import { data } from '@/data';
import { ColumnProps } from './Column/Column';
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
    onPunctuationToggle,
    onNumbersToggle,
  } = useContext(TypemodeContext);
  const { onOpenModal } = useContext(ModalContext);
  const typemodeKeys = Object.keys(data.typemode) as TypemodeType[];

  const colFirstButtons = useMemo<ColumnProps['buttons']>(() => {
    const active = [];
  }, []);
  return <div className="">typemode menu</div>;
}

export default Typemode;
