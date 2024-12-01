import { Fragment, useContext } from 'react';
import styles from './LoadingError.module.scss';
import { ModalContext } from '@/contexts/modalContext/modal.context';
import { ButtonRounded, Tooltip } from '@/components/UI';
import { IconRedirect, IconTags } from '@/assets/image';
import { data } from '@/data';
import { TypemodeContext } from '@/contexts/typemode.context';

interface Props {
  status: 404 | 500;
}
function LoadingError({ status }: Props) {
  const { mode, quote, onMode } = useContext(TypemodeContext);
  const { onOpenModal } = useContext(ModalContext);
  return (
    <div className={styles.container}>
      {status === 500 ? (
        <>
          <div>
            Failed to load quote from a{' '}
            <div className={styles.apiTooltipContainer}>
              <Tooltip
                text={
                  <div className={styles.apiTooltipText}>
                    <span>QuotSlate API</span>
                    <IconRedirect className={styles.apiTooltipTextIcon} />
                  </div>
                }
                position="top"
                showOnHover
              >
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://github.com/musheer360/QuoteSlate"
                  className={styles.apiLink}
                >
                  Third-party API
                </a>
              </Tooltip>
            </div>
            .Try Again Later
          </div>
          <p className={styles.textSecondary}>
            For Now you can try other modes
          </p>
          <div className={styles.buttonsWrapper}>
            {Object.keys(data.typemode).map(mapMode =>
              mapMode === mode ? (
                <Fragment key={mapMode} />
              ) : (
                <ButtonRounded
                  key={mapMode}
                  variant="2"
                  className={styles.typemodeButton}
                  onClick={() => onMode(mapMode as typeof mode)}
                >
                  {mapMode}
                </ButtonRounded>
              )
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.quoteNotFound}>
            <p>
              Couldn't find a {quote !== 'all' && quote} quote with selected
              tags.
            </p>
            <p className={styles.textSecondary}>
              Try changing the quote length to{' '}
              <span className="bold">'all'</span> or update the quote tags.
            </p>
            <div className={styles.buttonsWrapper}>
              <ButtonRounded
                variant="2"
                className={styles.typemodeButton}
                onClick={() => onOpenModal({ modal: 'quoteTags' })}
              >
                <IconTags className={styles.typemodeButtonIcon} />
                <span>Update Tags</span>
              </ButtonRounded>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LoadingError;
