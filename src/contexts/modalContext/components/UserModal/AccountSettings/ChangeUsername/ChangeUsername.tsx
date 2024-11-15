import { httpChangeUsername } from '@/api/auth';
import { IconPassword, IconUsername } from '@/assets/image';
import { InputField } from '@/components/UI';
import SubmitForm from '@/components/UI/SubmitForm/SubmitForm';
import { ProfileContext } from '@/contexts/profile.context';
import useForm from '@/hooks/useForm';
import { useContext, useState } from 'react';

interface Props {
  onGoBack: () => void;
  passwordRequired: boolean;
}
function ChangeUsername(props: Props) {
  const { onGoBack, passwordRequired } = props;
  const { onUpdateUsername } = useContext(ProfileContext);
  const { fields, error, onFieldChange, validateEmpty, setError } = useForm([
    'newUsername',
    'password',
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (passwordRequired) {
        validateEmpty();
      } else {
        validateEmpty(['newUsername']);
      }
      setLoading(true);
      httpChangeUsername(fields.newUsername, fields.password)
        .then(data => {
          onUpdateUsername(data.username);
          onGoBack();
        })
        .catch(err => {
          setError({ message: err?.message, field: err.field });
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return <SubmitForm onSubmit={handleSubmit}
    errorMessage={error?.message}
    submitLoading={loading}>
    <InputField Icon={IconUsername}
      placeholder='New Username'
      value={fields.newUsername}
      error={error?.field === 'newUsername'}
    onChange={(e) =>  onFieldChange(e, 'newUsername')}
    />
    {passwordRequired &&
      <InputField
        Icon={IconPassword}
        placeholder='confirm password'
        type='password'
        value={fields.password}
        error={error?.field === 'password'}
        showPassword={{
          bool: showPassword,
          onToggle: () => setShowPassword((state) => !state)
        }}
        onChange={(e) => onFieldChange(e, 'password')}
      />
    }
  </SubmitForm>
}

export default ChangeUsername;
