import styles from './TextButton.module.scss';
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}
function TextButton(props: Props) {
  const { isActive, className, children, ...rest } = props;
  return (
    <button
      className={`${styles.button} ${isActive && styles.active} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default TextButton;
