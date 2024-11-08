import styles from './Footer.module.scss';
import { useContext } from 'react';
import { TypingContext } from '@/contexts/typing.context';
import { Tooltip } from '../UI';
import { IconGithub, IconRedirect } from '@/assets/image';
function Footer() {
  const { typingFocused } = useContext(TypingContext);
  return (
    <footer
      className={`${styles.footer} opacity-transition ${typingFocused ? 'hide' : ''}`}
    >
      <div className={styles.links}>
        <Tooltip
          text={
            <div className={styles['github-hover-wrapper']}>
              <p> Repository</p>
              <IconRedirect className={styles['github-hover-wrapper__icon']} />
            </div>
          }
          position="right"
          showOnHover
        >
          <a
            href="https://github.com/jet-black-ninja/butterfingers2-frontend"
            rel="noreferrer"
            target="_blank"
            className={styles.linksItemAnchor}
            tabIndex={typingFocused ? -1 : undefined}
          >
            <IconGithub />
          </a>
        </Tooltip>
      </div>
    </footer>
  );
}

export default Footer;
