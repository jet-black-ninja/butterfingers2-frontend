import styles from './CopyButton.module.scss';
import ButtonRounded from '../ButtonRounded/ButtonRounded';
import Tooltip from '../Tooltip/Tooltip';
import { useEffect, useState } from 'react';
import { IconContentCopy } from '@/assets/image';

interface Props {
  value: string;
  className?: string;
}
function CopyButton(props: Props) {
  const { value, className } = props;
  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {
    if (!value || copied) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
    });
  };
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);
  return (
    <Tooltip
      text={copied ? 'Copied!' : 'Copy'}
      position="top"
      showOnHover
      className={className}
    >
      <ButtonRounded
        className={styles['copy__button']}
        variant="1"
        onClick={handleCopyClick}
      >
        <IconContentCopy className={styles['copy__icon']} />
      </ButtonRounded>
    </Tooltip>
  );
}

export default CopyButton;
