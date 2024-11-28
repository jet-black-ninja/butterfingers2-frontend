import { useContext, useEffect, useMemo, useState } from 'react';
import styles from './OneVersusOne.module.scss';
import { TypingContext } from '@/contexts/typing.context';
import { OneVersusOnePlayerState, OneVersusOneStateType } from '@/types';
import socket from '@/api/socket';
import { disconnect } from 'process';
interface Props {
  roomCode: string | null;
}
let countDownInterval = NodeJS.Timeout;
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

  return <div className="">One Versus One</div>;
}

export default OneVersusOne;
