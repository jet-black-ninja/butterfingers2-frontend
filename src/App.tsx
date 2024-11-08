import './App.module.scss';
import Header from './components/Header/Header';
import Typing from './components/Typing/Typing';
import Footer from './components/Footer/Footer';
import { useContext, useState } from 'react';
import { useWindowDimensions } from './hooks';
import { TypingContext } from './contexts/typing.context';

function App() {
  const { typingFocused, resultPreview, typemodeVisible, onPreviewResult } =
    useContext(TypingContext);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [windowWidth] = useWindowDimensions();
  return (
    <>
      <Header
        roomCode={roomCode}
        windowWidth={windowWidth}
        onLogoClick={() => onPreviewResult(null)}
        onLeaveRoom={() => setRoomCode(null)}
      />
      <main>
        <Typing />
      </main>
      <Footer />
    </>
  );
}

export default App;
