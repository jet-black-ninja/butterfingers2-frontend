import { Modal } from '@/components/UI';
import styles from './UserModal.module.scss';
import { IconUser } from '@/assets/image';
import { useContext, useEffect, useState } from 'react';
import Profile from './Profile/Profile';
import { ProfileContext } from '@/contexts/profile.context';
import AccountSettings from './AccountSettings/AccountSettings';

interface Props {
  onClose: () => void;
}
function UserModal(props: Props) {
  const { onClose } = props;
  const { profile } = useContext(ProfileContext);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  useEffect(() => {
    if (!profile.username) onClose();
  }, []);
  return (
    <Modal
      heading={profile.username}
      HeadingIcon={IconUser}
      onClose={onClose}
      className={styles.modal}
    >
      <div className={styles.tabs}>
        <button
          className={`${styles.tabsButtons} ${activeTab === 'profile' && styles.active}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`${styles.tabsButtons} ${activeTab === 'settings' && styles.active}`}
          onClick={() => setActiveTab('settings')}
        >
          Account Setting
        </button>
      </div>
      {activeTab === 'profile' ? <Profile /> : <AccountSettings />}
    </Modal>
  );
}

export default UserModal;
