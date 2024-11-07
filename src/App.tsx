import './App.module.scss';
import Header from './components/Header/Header';
import Typing from './components/Typing/Typing';
import Footer from './components/Footer/Footer';
import { useState } from 'react';
import Loading from './components/UI/Loading/Loading';

function App() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  return (
    <>
      <Header roomCode={roomCode} />
      <main>
        <Typing />
        <Loading type="dot-flashing" />
      </main>
      <Footer />
    </>
  );
}

export default App;
