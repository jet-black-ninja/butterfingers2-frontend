import { TypingResult } from '@/types';
import styles from './Result.module.scss';
import { useContext } from 'react';
import { TypingContext } from '@/contexts/typing.context';
export type ResultOptions = {
  includeDate?: boolean;
}
interface Props extends ResultOptions {
  result: TypingResult;
  onRestart?: () => void;
  onRepeat?: () => void;
  onGoBack?: () => void;
}
function Result(props: Props) {
  const { result, includeDate, onRestart, onRepeat, onGoBack } = props;
  const { onTypingEnded } = useContext(TypingContext);

  return (
    <div className="">Result</div>
  );
}

export default Result;
