import styles from './Loading.module.scss';
interface Props {
  type: 'spinner' | 'dot-flashing';
  className?: string;
}
function Loading(props: Props) {
  const { type, className } = props;
  return (
    <div className={className || ''}>
      <div className={styles[type]} />
    </div>
  );
}

export default Loading;
