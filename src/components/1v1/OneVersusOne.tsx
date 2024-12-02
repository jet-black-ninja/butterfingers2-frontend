import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styles from './OneVersusOne.module.scss';
import { TypingContext } from '@/contexts/typing.context';
import {
  OneVersusOnePlayerState,
  OneVersusOneStateType,
  TypingResult,
} from '@/types';
import socket from '@/api/socket';
import Results from './Results/Results';
import Typing from '../Typing/Typing';
import { IconUser } from '@/assets/image';
import { CopyButton, Loading } from '../UI';
interface Props {
  roomCode: string | null;
}
let countDownInterval: NodeJS.Timeout;
function OneVersusOne(props: Props) {
  const { roomCode } = props;
  const { onTypingStarted } = useContext(TypingContext);
  const [roomState, setRoomState] = useState<OneVersusOneStateType | null>(
    null
  );
  const [startsInSeconds, setStartsInSeconds] = useState<number | null>(null);
  const currentPlayer = useMemo(() => {
    return roomState?.players.player1?.id === socket.id ? 'player1' : 'player2';
  }, [roomState?.players.player1?.id]);
  const opponentPlayer = useMemo(
    () => (currentPlayer === 'player1' ? 'player2' : 'player1'),
    [currentPlayer]
  );
  const currentPlayerState = roomState?.players[currentPlayer];
  const opponentPlayerState = roomState?.players[opponentPlayer];
  useEffect(() => {
    return () => {
      console.log('leave- triggered');
      socket.emit('leave-room');
    };
  }, []);
  useEffect(() => {
    socket.on('room-state', (argRoomState: OneVersusOneStateType) => {
      setRoomState(argRoomState);
    });

    socket.on('test-text', text => {
      setRoomState(state => (!state ? null : { ...state, testText: text }));
    });

    socket.on(
      'player-state',
      (playerState: OneVersusOneStateType['players']) => {
        setRoomState(state =>
          state === null ? null : { ...state, players: playerState }
        );
      }
    );
    socket.on(
      'caret-position-change',
      ({
        player,
        wordIndex,
        charIndex,
      }: {
        player: 'player1' | 'player2';
        wordIndex: number;
        charIndex: number;
      }) => {
        setRoomState(state => {
          if (!state) return null;

          return {
            ...state,
            players: {
              ...state.players,
              [player]: { ...state.players[player], wordIndex, charIndex },
            },
          };
        });
      }
    );

    socket.on('typing-starts-in', (ms: number) => {
      setStartsInSeconds(Math.max(Math.ceil(ms / 1000), 1));
    });
    socket.on('typing-started', () => {
      clearInterval(countDownInterval);
      setStartsInSeconds(0);
      onTypingStarted();
    });

    socket.on('opponent-play-again', () => {
      setRoomState(state => {
        if (!state) return null;
        return {
          ...state,
          players: {
            ...state.players,
            [opponentPlayer]: {
              ...state.players[opponentPlayer],
              playAgain: true,
            },
          },
        };
      });
    });

    socket.on('opponent-disconnected', () => {
      setRoomState(state => {
        if (!state) return null;

        return {
          ...state,
          players: {
            ...state.players,
            [opponentPlayer]: {
              ...state.players[opponentPlayer],
              disconnected: true,
            } as OneVersusOnePlayerState,
          },
        };
      });
    });
    return () => {
      socket.off('room-state');
      socket.off('test-text');
      socket.off('player-state');
      socket.off('caret-position-change');
      socket.off('typing-starts-in');
      socket.off('typing-started');
      socket.off('opponent-play-again');
      socket.off('opponent-disconnected');
    };
  }, [onTypingStarted, opponentPlayer, currentPlayer]);

  const handleCaretPositionChange = useCallback(
    (wordIndex: number, charIndex: number) => {
      socket.emit('caret-position-change', { wordIndex, charIndex });
    },
    []
  );
  const handleResult = useCallback(
    (result: TypingResult) => {
      socket.emit('result', result);
      setRoomState(state => {
        if (!state) return null;
        return {
          ...state,
          players: {
            ...state.players,
            [currentPlayer]: {
              ...state.players[currentPlayer],
              result,
            } as OneVersusOnePlayerState,
          },
        };
      });
    },
    [currentPlayer]
  );
  const handlePlayAgain = useCallback(() => {
    socket.emit('play-again');
    setRoomState(state => {
      if (!state) return null;
      return {
        ...state,
        players: {
          ...state.players,
          [currentPlayer]: { ...state.players[currentPlayer], playAgain: true },
        },
      };
    });
  }, [currentPlayer]);

  const showResult =
    currentPlayerState?.result &&
    (currentPlayerState?.result || opponentPlayerState?.disconnected);

  useEffect(() => {
    if (showResult) {
      setStartsInSeconds(null);
    }
  }, [showResult]);
  return (
    <>
      {roomState?.players.player2 ? (
        showResult ? (
          <Results
            playersState={roomState.players}
            currentPlayer={currentPlayer}
            opponentPlayer={opponentPlayer}
            onPlayAgain={handlePlayAgain}
          />
        ) : (
          <div className={styles.typingWrapper}>
            {startsInSeconds !== null && (
              <span
                className={`${styles.countdown} ${!startsInSeconds && styles.countdownFadeOut}`}
              >
                {startsInSeconds || 'GO!'}
              </span>
            )}
            <Typing
              testText={roomState!.testText || ''}
              typeModeCustom={`quote ${roomState.quoteLength}`}
              onCaretPositionChange={handleCaretPositionChange}
              secondCaret={{
                wordIndex: opponentPlayerState?.wordIndex || 0,
                charIndex: opponentPlayerState?.charIndex || 0,
              }}
              oneVersusOne
              onResult={handleResult}
            />
          </div>
        )
      ) : (
        <div className={styles.waitingWrapper}>
          <div className={styles.roomCode}>
            <span className={styles.roomCodeText}>Room Code:</span>
            <span className={styles.roomCodeTextCode}>{roomCode}</span>
            <CopyButton
              className={styles.roomCodeCopyButton}
              value={roomCode}
            />
          </div>
          <div className={styles.players}>
            <div className={styles.player}>
              <span className={styles.playerText}>You</span>
              <IconUser className={styles.IconUser} />
            </div>
            <span className={styles.textVs}>vs</span>
            <div className={styles.player}>
              <span className={styles.playerText}>Opponent</span>
              <Loading type="dot-flashing" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OneVersusOne;
