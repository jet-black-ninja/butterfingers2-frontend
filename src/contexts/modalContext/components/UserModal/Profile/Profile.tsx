import styles from './Profile.module.scss'
import Stats from './Stats/Stats';
import History from './History/History';
import { IconHistory, IconStats } from '@/assets/image';
interface Props{
    onCloseModal : () => void;
}
function Profile({ onCloseModal }: Props) {

    return ( 
        <div className={styles.container}>
            <div className={styles.title}>
                <IconStats className={styles.titleIcon} />
                <span>Stats</span>
            </div>
            <Stats/>
            <div className={styles.title}>
                <IconHistory className={styles.titleIcon} viewBox='0 0 34 32' />
                <span>History</span>

            </div>
            <History onCloseModal={onCloseModal} /></div>
 );
}

export default Profile;