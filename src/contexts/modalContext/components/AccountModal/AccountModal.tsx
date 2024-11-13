import {
  IconAccount,
  IconCustomize,
  IconHistory,
  IconStats,
} from '@/assets/image';
import { Modal } from '@/components/UI';
import { ProfileContext } from '@/contexts/profile.context';
import { useContext, useEffect, useState } from 'react';
import styles from './AccountModal.module.scss';
import CreateNewAccount from './CreateNewAccount/CreateNewAccount';
import Login from './Login/Login';
interface Props {
  onClose: () => void;
}
function AccountModal(props: Props) {
  const { onClose } = props;
  const { profile } = useContext(ProfileContext);
  const [tab, setTab] = useState<'create-account' | 'log-in'>('create-account');

  const serverURL = import.meta.env.PROD;

  const githubClientID: string | undefined = import.meta.env
    .VITE_GITHUB_CLIENT_ID;
  const googleClientID: string | undefined = import.meta.env
    .VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (profile.username) {
      onClose();
    }
  }, [profile]);

  return (
    <Modal
      onClose={onClose}
      heading="Account"
      HeadingIcon={IconAccount}
      className={styles.modal}
    >
      <div className={styles.topContainer}>
        <button
          className={`${styles.topContainerButtons} ${
            tab === 'create-account' ? styles.active : ''
          }`}
          onClick={() => setTab('create-account')}
        >
          Create Account
        </button>
        <button
          className={`${styles.topContainerButtons} ${
            tab === 'log-in' ? styles.active : ''
          }`}
          onClick={() => setTab('log-in')}
        >
          Log In
        </button>
      </div>
      {tab === 'create-account' ? <CreateNewAccount /> : <Login />}
      {tab === 'create-account' && (
        <>
          <div className={styles.dividerText}>
            <div className={styles.dividerTextContent}>
              <div>Account Benefits</div>
            </div>
          </div>
          <ul className={styles.benefits}>
            <li className={styles.benefitsItem}>
              <IconStats className={styles.benefitsItemIcon} />
              <span>Personal Stats</span>
            </li>
            <li className={styles.benefitsItem}>
              <IconHistory className={styles.benefitsItemIcon} />
              <span>Previous Results(history)</span>
            </li>
            <li className={styles.benefitsItem}>
              <IconCustomize className={styles.benefitsItemIcon} />
              <span>Customizations saved to cloud</span>
            </li>
          </ul>
        </>
      )}
    </Modal>
  );
}

export default AccountModal;
