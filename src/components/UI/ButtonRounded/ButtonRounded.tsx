import styles from './ButtonRounded.module.scss';
import { forwardRef } from 'react';
import Loading from '@/components/UI/Loading/Loading';
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: '1' | '2';
  loading?: boolean;
  active?: boolean;
}
type Ref = HTMLButtonElement;

export default forwardRef<Ref, Props>(function ButtonRounded(props, ref) {
  const {
    variant = '1',
    loading,
    className,
    children,
    disabled,
    active,
    ...restProps
  } = props;
  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]} 
        ${active && styles.active} ${disabled || loading ? styles['button--disabled'] : ''} 
        ${loading ? styles['button--loading'] : ''} ${className}`}
      disabled={disabled || loading}
      {...restProps}
      ref={ref}
    >
      {loading && <Loading type="spinner" className={styles.loadingSpinner} />}
      {children}
    </button>
  );
});
