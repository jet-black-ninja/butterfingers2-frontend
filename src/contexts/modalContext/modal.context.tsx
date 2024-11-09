import OAuthFinalStepsModal, {
  OAuthFinalStepsModalOptions,
} from './components/OAuthFinalStepsModal/OAuthFinalStepsModal';
import { createContext, useContext, useEffect, useState } from 'react';
import { TypingContext } from '../typing.context';
import { ProfileContext } from '../profile.context';
import { createPortal } from 'react-dom';
import CustomizeModal from './components/CustomizeModal/CustomizeModal';
import OneVersusOneModal from './components/OneVersusOneModal/OneVersusOneModal';
import AccountModal from './components/AccountModal/AccountModal';
import QuoteTagsModal from './components/QuoteTagModal/QuoteTagsModal';
import UserModal from './components/UserModal/UserModal';

export type ModalType =
  | { modal: 'customize' }
  | { modal: 'oneVersusOne' }
  | { modal: 'account' }
  | { modal: 'quoteTags' }
  | { modal: 'user' }
  | { modal: 'oAuthFinalSteps'; options: OAuthFinalStepsModalOptions }
  | null;

export interface ModalContextType {
  activeModal: ModalType;
  onOpenModal: (modal: ModalType) => void;
}
const initial: ModalContextType = {
  activeModal: null,
  onOpenModal: () => {},
};
export const ModalContext = createContext(initial);

export function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeModal, setActiveModal] = useState(initial.activeModal);
  const { onTypingAllow, onTypingDisable } = useContext(TypingContext);
  const { oAuthFinalSteps } = useContext(ProfileContext);

  const onOpenModal: ModalContextType['onOpenModal'] = modal => {
    setActiveModal(modal);
  };

  useEffect(() => {
    if (activeModal) {
      onTypingDisable();
    } else {
      onTypingAllow();
    }
  }, [activeModal]);
  useEffect(() => {
    if (oAuthFinalSteps) {
      setActiveModal({
        modal: 'oAuthFinalSteps',
        options: { platform: oAuthFinalSteps },
      });
    } else {
      setActiveModal(null);
    }
  }, [oAuthFinalSteps]);

  return (
    <ModalContext.Provider value={{ activeModal, onOpenModal }}>
      {children}
      {activeModal &&
        createPortal(
          activeModal.modal === 'oneVersusOne' ? (
            <OneVersusOneModal onClose={() => onOpenModal(null)} />
          ) : activeModal.modal === 'customize' ? (
            <CustomizeModal onClose={() => onOpenModal(null)} />
          ) : activeModal.modal === 'account' ? (
            <AccountModal onClose={() => onOpenModal(null)} />
          ) : activeModal.modal === 'quoteTags' ? (
            <QuoteTagsModal onClose={() => onOpenModal(null)} />
          ) : activeModal.modal === 'user' ? (
            <UserModal onClose={() => onOpenModal(null)} />
          ) : activeModal.modal === 'oauthFinalSteps' ? (
            <OAuthFinalStepsModal
              options={activeModal.options}
              onClose={() => onOpenModal(null)}
            />
          ) : null,
          document.body
        )}
    </ModalContext.Provider>
  );
}
