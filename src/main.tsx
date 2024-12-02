// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';
import { TypingContextProvider } from './contexts/typing.context.tsx';
import { TypemodeContextProvider } from './contexts/typemode.context.tsx';
import { ProfileContextProvider } from './contexts/profile.context.tsx';
import { ModalContextProvider } from './contexts/modalContext/modal.context.tsx';

createRoot(document.getElementById('root')!).render(
  <ProfileContextProvider>
    <TypingContextProvider>
      <TypemodeContextProvider>
        <ModalContextProvider>
          <App />
        </ModalContextProvider>
      </TypemodeContextProvider>
    </TypingContextProvider>
  </ProfileContextProvider>
);
