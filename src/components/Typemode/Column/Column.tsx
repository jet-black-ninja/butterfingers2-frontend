import { useEffect, useState } from 'react';
import styles from './Column.module.scss';
import { TextButton } from '@/components/UI';

export interface ColumnProps {
  buttons: {
    text: string | number;
    active: boolean;
    action: () => void;
    Icon?: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string | undefined;
      }
    >;
  }[];
}
function Column(props: ColumnProps) {
  const { buttons } = props;
  const [containerSize, setContainerSize] = useState(() => ({
    width: 0,
    height: 0,
  }));
  useEffect(() => {
    setTimeout(() => {
      setHasUpdatedSize(false);
    }, 200);
  }, []);
  useEffect(() => {
    setHasUpdatedSize(false);
  }, [buttons]);
  const [hasUpdatedSize, setHasUpdatedSize] = useState<boolean>(false);
  return (
    <div
      className={styles.container}
      style={{ width: containerSize.width, height: containerSize.height }}
    >
      <div
        className={styles.contextWrapper}
        ref={node => {
          if (node && !hasUpdatedSize) {
            setHasUpdatedSize(true);
            setContainerSize({
              width: node.clientWidth,
              height: node.clientHeight,
            });
          }
        }}
      >
        {buttons.map(({ text, active, action, Icon }) => (
          <TextButton
            key={text}
            className={styles.button}
            isActive={active}
            onClick={action}
          >
            {Icon && <Icon className={styles.buttonIcon} />}
            <span>{text}</span>
          </TextButton>
        ))}
      </div>
    </div>
  );
}

export default Column;
