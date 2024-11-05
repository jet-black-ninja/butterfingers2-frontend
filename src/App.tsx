import './App.module.scss';
import Header from './components/Header/Header';
import Typing from './components/Typing/Typing';
import Footer from './components/Footer/Footer';
import { useState } from 'react';
import CopyButton from './components/UI/CopyButton/CopyButton';
function App() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  return (
    <>
      <Header roomCode={roomCode} />
      <main>
        <Typing />
      </main>
      <Footer />
    </>
  );
}

export default App;
