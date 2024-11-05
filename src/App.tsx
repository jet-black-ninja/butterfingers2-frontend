import './App.module.scss';
import Header from './components/Header/Header';
import Typing from './components/Typing/Typing';
import Footer from './components/Footer/Footer';
import { useState } from 'react';
import Logo from './components/UI/Logo/Logo';
function App() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  return (
    <>
      <Header roomCode={roomCode} />
      <main>
        <Typing />
        <Logo colored={true}></Logo>
      </main>
      <Footer />
    </>
  );
}

export default App;
