import { useContext } from 'react';
import styles from './QuoteTagsModal.module.scss';
import { TypemodeContext } from '@/contexts/typemode.context';
import { ButtonRounded, Modal } from '@/components/UI';
import { IconTags } from '@/assets/image';
interface Props {
  onClose: () => void;
}
function QuoteTagsModal(props: Props) {
  const { onClose } = props;
  const {
    quoteTags,
    quoteTagsMode,
    onToggleQuoteTag,
    onUpdateQuoteTagsMode,
    onClearSelectedQuoteTags,
  } = useContext(TypemodeContext);
  const onQuoteSelectionChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const checkbox = e.target as unknown as HTMLInputElement;
    onToggleQuoteTag(Number(checkbox.value));
  };

  return (
    <Modal HeadingIcon={IconTags} heading="Quote Tags" onClose={onClose}>
      <div className={styles.modeContainer}>
        <ButtonRounded
          variant="2"
          className={`${styles.modeContainerButton} ${styles.modeContainerButtonFirst}`}
          active={quoteTagsMode === 'all'}
          onClick={() => onUpdateQuoteTagsMode('all')}
        >
          All
        </ButtonRounded>
        <ButtonRounded
          variant="2"
          className={`${styles.modeContainerButton} ${styles.modeContainerButtonSecond}`}
          active={quoteTagsMode === 'only selected'}
          onClick={() => onUpdateQuoteTagsMode('only selected')}
        >
          Only Selected
        </ButtonRounded>
      </div>
      <form
        className={`${styles.quoteTagsForm} ${quoteTagsMode === 'all' && styles.disabled}`}
        onChange={onQuoteSelectionChange}
      >
        <span className={`${styles.label} ${styles.active}`}>Tags</span>
        <div className={styles.quoteTagsContainer}>
          {quoteTags.map((tag, index) => (
            <label
              className={`${styles.quoteTag} ${tag.isSelected && styles.checked}`}
              key={tag.name}
            >
              <input
                type="checkbox"
                checked={tag.isSelected}
                value={index}
                className={styles.quoteTagCheckbox}
              />

            </label>
          ))}
        </div>
        <ButtonRounded
          variant="2"
          className={styles.buttonClearTags}
          onClick={() => onClearSelectedQuoteTags}
          type="button"
        >
          Clear Tags
        </ButtonRounded>
      </form>
    </Modal>
  );
}

export default QuoteTagsModal;
