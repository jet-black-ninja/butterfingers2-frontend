import styles from './App.module.scss';
import Header from './components/Header/Header';
import Typing from './components/Typing/Typing';
import Footer from './components/Footer/Footer';
import { useContext, useEffect, useState } from 'react';
import { useWindowDimensions } from './hooks';
import { TypingContext } from './contexts/typing.context';
import Typemode from './components/Typemode/Typemode';
import { ModalContext } from './contexts/modalContext/modal.context';
import socket from './api/socket';
import OneVersusOne from './components/1v1/OneVersusOne';
import Result from './components/Typing/Result/Result';

function App() {
  const { typingFocused, resultPreview, typemodeVisible, onPreviewResult } =
    useContext(TypingContext);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const { activeModal, onOpenModal } = useContext(ModalContext);
  const [windowWidth] = useWindowDimensions();
  /**
   * Effect hook to listen for room join event from the socket.
   * If the active modal is 'oneVersusOne', it sets the room code and hides the modal when joined.
   */
  useEffect(() => {
    if (activeModal?.modal === 'oneVersusOne') {
      socket.on('has-joined-room', (roomCode: string) => {
        setRoomCode(roomCode);
        onOpenModal(null);
      });
    }
    return () => {
      socket.off('has-joined-room');
    };
  }, [activeModal]);
  return (
    <>
      <Header
        roomCode={roomCode}
        windowWidth={windowWidth}
        onLogoClick={() => onPreviewResult(null)}
        onLeaveRoom={() => setRoomCode(null)}
      />
      {!roomCode && typemodeVisible && (
        <Typemode
          className={`opacity-transition ${typingFocused ? 'hide' : ''} ${
            styles.typemode
          }`}
        />
      )}
      <main
        className={`${styles.main} ${!roomCode && typemodeVisible ? styles.mainMarginBottom : ''}`}
      >
        {roomCode ? (
          <OneVersusOne roomCode={roomCode} />
        ) : (
          <>
            {resultPreview ? (
              <Result
                result={resultPreview.state}
                onGoBack={() => onPreviewResult(null)}
                {...resultPreview.options}
              />
            ) : (
              <Typing />
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
