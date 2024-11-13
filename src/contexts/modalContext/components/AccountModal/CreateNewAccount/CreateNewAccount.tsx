import useForm from '@/hooks/useForm';
import styles from './CreateNewAccount.module.scss';
import { useContext, useState } from 'react';
import { ProfileContext } from '@/contexts/profile.context';
import { CreateAccount } from '@/api/auth';
import { ButtonRounded, InputField } from '@/components/UI';
import { IconEmail, IconPassword, IconUsername } from '@/assets/image';

const fieldsArr = ['username', 'email', 'password', 'confirmPassword'];
const createAccountAbortController = new AbortController();

function CreateNewAccount() {
  const { fields, error, setError, onFieldChange, validateEmpty } =
    useForm(fieldsArr);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { onUpdateUsername } = useContext(ProfileContext);

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      validateEmpty();
      if (fields.password !== fields.confirmPassword) {
        setError({
          field: ' repeatPassword',
          message: 'Passwords do no match',
        });
        throw new Error();
      }
    } catch (err: any) {
      return setSubmitLoading(false);
    }
    CreateAccount(
      fields.username,
      fields.email,
      fields.password,
      createAccountAbortController
    )
      .then(data => {
        onUpdateUsername(data);
      })
      .catch(err => {
        const parsedError = JSON.parse(err.message);
        if (parsedError?.message) {
          setError({
            field: parsedError.field,
            message: parsedError.message,
          });
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  return (
    <form className={styles.container} onSubmit={handelSubmit}>
      <InputField
        classNameContainer={styles.inputContainer}
        Icon={IconUsername}
        placeholder="username"
        error={error?.field === 'username'}
        value={fields.username}
        onChange={e => onFieldChange(e, 'username')}
      />
      <InputField
        classNameContainer={styles.inputContainer}
        Icon={IconEmail}
        placeholder="email"
        type="email"
        value={fields.email}
        onChange={e => onFieldChange(e, 'email')}
        error={error?.field === 'email'}
      />
      <InputField
        Icon={IconPassword}
        classNameContainer={styles.inputContainer}
        placeholder="password"
        type="password"
        value={fields.password}
        onChange={e => onFieldChange(e, 'password')}
        error={error?.field === 'password'}
        showPassword={{
          bool: isPasswordVisible,
          onToggle: () => setIsPasswordVisible(state => !state),
        }}
      />
      <InputField
        Icon={IconPassword}
        classNameContainer={styles.inputContainer}
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder="confirm password"
        value={fields.confirmPassword}
        onChange={e => onFieldChange(e, 'confirmPassword')}
        error={error?.field === 'confirmPassword'}
      />
      <div className={styles.errorContainer}>
        {error && <p>{error.message}</p>}
      </div>
      <ButtonRounded type="submit" variant="2" loading={submitLoading}>
        Create Account
      </ButtonRounded>
    </form>
  );
}

export default CreateNewAccount;
