import { useContext, useState } from 'react';
import styles from './ResetStats.module.scss';
import { ProfileContext } from '@/contexts/profile.context';
import useForm from '@/hooks/useForm';
import SubmitForm from '@/components/UI/SubmitForm/SubmitForm';
import { InputField } from '@/components/UI';
import { IconPassword } from '@/assets/image';
import { httpResetStats } from '@/api/profile';
interface Props {
  onGoBack: () => void;
  passwordRequired: boolean;
}
function ResetStats(props: Props) {
  const { onGoBack, passwordRequired } = props;
  const { onResetStats } = useContext(ProfileContext);
  const { fields, error, onFieldChange, validateEmpty, setError } = useForm([
    'password',
  ]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (passwordRequired) {
        validateEmpty();
      }
      httpResetStats(fields.password)
        .then(() => {
          onResetStats();
          onGoBack();
        })
        .catch((err: any) => {
          const message = err?.message;
          if (message) {
            setError({ field: 'password', message: message });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <p className={styles.warningMessage}>
        This Action Cannot Be undone. This will reset all your stats. Proceed
        with caution.
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

export default ResetStats;
