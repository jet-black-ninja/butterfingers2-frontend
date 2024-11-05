import { IconKeyboard } from '@/assets/image';
import styles from './Logo.module.scss';
interface Props {
  colored: boolean;
}
function Logo(props: Props) {
  const { colored } = props;
  return (
    <div
      className={`${styles.logo} ${
        styles[`logo--${colored ? 'color' : 'nocolor'}`]
      }`}
    >
      <IconKeyboard className={styles.icon} />
      <div className={styles['text-div']}>
        <span className={styles['text-div__title']}>Butter Fingers</span>
        <span className={styles['text-div__subtitle']}>Glide on the board</span>
      </div>
    </div>
  );
}

export default Logo;
