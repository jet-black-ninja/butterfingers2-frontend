import { useRef } from 'react';
import styles from './Restart.module.scss';
import { ButtonRounded, Tooltip } from '@/components/UI';
import { IconRefresh } from '@/assets/image';
interface Props {
  onRestart: () => void;
  className?: string;
}
function Restart(props: Props) {
  const { onRestart, className } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const resetHandler = () => {
    onRestart();
    divRef.current?.focus();
    resetRef.current?.blur();
  };
  return (
    <>
      <div ref={divRef} tabIndex={-1}>
        <Tooltip
          text="restart"
          showOnHover
          className={`${styles.restart} ${className}`}
        >
          <ButtonRounded ref={resetRef} onClick={resetHandler}>
            <IconRefresh className={styles.icon} />
          </ButtonRounded>
        </Tooltip>
      </div>
    </>
  );
}

export default Restart;
