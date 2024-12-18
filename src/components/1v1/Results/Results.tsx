import { OneVersusOneStateType } from '@/types';
import styles from './Results.module.scss';
import { useState } from 'react';
import { ButtonRounded, Tooltip } from '@/components/UI';
import { IconRefresh, IconTrophy } from '@/assets/image';
import Result from '@/components/Typing/Result/Result';

interface Props {
  playersState: OneVersusOneStateType['players'];
  currentPlayer: 'player1' | 'player2';
  opponentPlayer: 'player1' | 'player2';
  onPlayAgain: () => void;
}
export default function Results(props: Props) {
  const { playersState, currentPlayer, opponentPlayer, onPlayAgain } = props;
  console.log(playersState[currentPlayer]?.result);
  let wpmYou = 0;
  let wpmOpponent = 0;
  try {
    wpmYou =
      playersState[currentPlayer]!.result!.timeline[
        playersState[currentPlayer]!.result!.timeline.length - 1
      ].wpm;
  } catch (err) {
    console.log(err);
  }
  try {
    wpmOpponent =
      playersState[opponentPlayer]!.result!.timeline[
        playersState[opponentPlayer]!.result!.timeline.length - 1
      ].wpm;
  } catch (err) {
    console.log(err);
  }

  const [showPlayerResult, setShowPlayerResult] = useState<
    'player1' | 'player2'
  >(currentPlayer);

  const winner =
    wpmYou! > wpmOpponent!
      ? currentPlayer
      : wpmYou! < wpmOpponent!
        ? opponentPlayer
        : null;

  return (
    <>
      <span
        className={`${styles.winnerText} ${
          winner === currentPlayer
            ? styles.winnerTextWon
            : winner === opponentPlayer
              ? styles.winnerTextLost
              : ''
        }`}
      >
        {!winner ? 'Tie!' : winner === currentPlayer ? 'You Won!' : 'You Lost!'}
      </span>
      <div className={styles.playerResultButtonsWrapper}>
        <div className={styles.playerResultButtons}>
          <ButtonRounded
            className={`${styles.playerResultButtonsBtn} ${
              styles.playerResultButtonsBtnFirst
            } ${currentPlayer === showPlayerResult ? styles.active : ''}`}
            onClick={() => setShowPlayerResult(currentPlayer)}
          >
            {winner === currentPlayer && (
              <IconTrophy className={styles.iconTrophy} />
            )}
            <span>You</span>
          </ButtonRounded>

          {!playersState[opponentPlayer]?.result ? (
            <Tooltip
              className={styles.playerResultButtonsBtnTooltip}
              text={
                <div>
                  <p>Opponent hasn't finished the test</p>
                  <p>(disconnected).</p>
                </div>
              }
              showOnHover
            >
              <ButtonRounded
                className={`${styles.playerResultButtonsBtn} ${
                  styles.playerResultButtonsBtnSecond
                } ${opponentPlayer === showPlayerResult ? styles.active : ''}`}
                onClick={() => setShowPlayerResult(opponentPlayer)}
                disabled={playersState[opponentPlayer]?.disconnected}
              >
                {winner === opponentPlayer && (
                  <IconTrophy className={styles.iconTrophy} />
                )}
                <span>Opponent</span>
              </ButtonRounded>
            </Tooltip>
          ) : (
            <ButtonRounded
              className={`${styles.playerResultButtonsBtn} ${
                styles.playerResultButtonsBtnSecond
              } ${opponentPlayer === showPlayerResult ? styles.active : ''}`}
              onClick={() => setShowPlayerResult(opponentPlayer)}
              disabled={!playersState[opponentPlayer]?.result}
            >
              {winner === opponentPlayer && (
                <IconTrophy className={styles.iconTrophy} />
              )}
              <span>Opponent</span>
            </ButtonRounded>
          )}
        </div>
      </div>

      {playersState[showPlayerResult]?.result && (
        <Result result={playersState[showPlayerResult]!.result!} />
      )}

      <div className={styles.playAgainWrapper}>
        <ButtonRounded
          variant="2"
          className={styles.playAgain}
          onClick={onPlayAgain}
          disabled={
            playersState[currentPlayer]?.playAgain ||
            playersState[opponentPlayer]?.disconnected
          }
        >
          <IconRefresh className={styles.playAgainIcon} />
          <span>Play Again</span>
        </ButtonRounded>
        <span className={styles.playAgainText}>
          {playersState[opponentPlayer]?.disconnected
            ? 'Opponent disconnected!'
            : playersState[opponentPlayer]?.playAgain
              ? 'Opponent wants to play again!'
              : playersState[currentPlayer]?.playAgain
                ? 'Play again requested to your opponent!'
                : ''}
        </span>
      </div>
    </>
  );
}
