import { useContext } from 'react';
import styles from './Typemode.modules.scss';
import { TypemodeContext } from '@/contexts/typemode.context';
import {
  ModalContext,
  ModalContextType,
} from '@/contexts/modalContext/modal.context';
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
  return <div className="">typemode menu</div>;
}

export default Typemode;
