import styles from './ClearHistory.module.scss';
import useForm from '@/hooks/useForm';
import { useContext, useState } from 'react';
import { httpClearHistory } from '@/api/profile';
import { ProfileContext } from '@/contexts/profile.context';
import SubmitForm from '@/components/UI/SubmitForm/SubmitForm';
import { InputField } from '@/components/UI';
import { IconPassword } from '@/assets/image';
interface Props {
  onGoBack: () => void;
  passwordRequired: boolean;
}
function ClearHistory(props: Props) {
  const { onGoBack, passwordRequired } = props;
  const { fields, error, onFieldChange, validateEmpty, setError } = useForm([
    'password',
  ]);
  const { onClearHistory } = useContext(ProfileContext);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (passwordRequired) {
        validateEmpty();
      }
      httpClearHistory(fields.password)
        .then(() => {
          onClearHistory();
          onGoBack();
        })
        .catch(err => {
          if (err.message) {
            setError({ message: err.message, field: 'password' });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <>
      <p className={styles.warningMessage}>
        This Action Cannot Be undone. This will clear the history completely.
      </p>
      <SubmitForm
        onSubmit={handleFormSubmit}
        errorMessage={error?.message}
        submitLoading={loading}
      >
        {passwordRequired && (
          <InputField
            Icon={IconPassword}
            type="password"
            placeholder="Password"
            value={fields.password}
            onChange={e => onFieldChange(e, 'password')}
            error={error?.field === 'password'}
            showPassword={{
              bool: showPassword,
              onToggle: () => setShowPassword(state => !state),
            }}
          />
        )}
      </SubmitForm>
    </>
  );
}

export default ClearHistory;
