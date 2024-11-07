import styles from './SubmitForm.module.scss';
import { ButtonRounded } from '@/components/UI';

interface Props extends React.FormHTMLAttributes<HTMLFormElement> {
  errorMessage?: string;
  submitLoading?: boolean;
}
function SubmitForm(props: Props) {
  const { errorMessage, submitLoading, className, children, ...restProps } =
    props;
  return (
    <form className={`${styles.form} ${className || ''}`} {...restProps}>
      {children}
      <p className={styles.error}>{errorMessage || ''}</p>
      <ButtonRounded
        variant="2"
        type="submit"
        className={styles.btnSubmit}
        loading={submitLoading}
      >
        Confirm
      </ButtonRounded>
    </form>
  );
}

export default SubmitForm;
