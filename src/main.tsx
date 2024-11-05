import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';
import { TypingContextProvider } from './contexts/typing.context.tsx';
import { TypemodeContextProvider } from './contexts/typemode.context.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TypingContextProvider>
      <TypemodeContextProvider>
        <App />
      </TypemodeContextProvider>
    </TypingContextProvider>
  </StrictMode>
);
