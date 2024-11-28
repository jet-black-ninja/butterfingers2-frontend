import { OneVersusOneStateType } from '@/types';
import styles from './Result.module.scss';

interface Props {
  playerState: OneVersusOneStateType['players'];
  currentPlayer: 'player1' | 'player2';
  opponentPlayer: 'player1' | 'player2';
  onPlayAgain: () => void;
}
export default function Results(props: Props) {
  return <>1v1 results</>;
}
