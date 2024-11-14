import { useContext, useEffect, useState } from 'react';
import styles from './Login.module.scss';
import { ProfileContext } from '@/contexts/profile.context';
import useForm from '@/hooks/useForm';
import { LogIn } from '@/api/auth';
import { ButtonRounded, InputField } from '@/components/UI';
import { IconEmail, IconPassword, IconUsername } from '@/assets/image';

const logInAbortController = new AbortController();
function Login() {
  const { onLoadProfileData } = useContext(ProfileContext);
  const { fields, error, setError, onFieldChange, validateEmpty } = useForm([
    'username',
    'email',
    'password',
  ]);
  const [logInWith, setLogInWith] = useState<'username' | 'email'>('username');
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      validateEmpty(
        logInWith === 'username'
          ? ['username', 'password']
          : ['email', 'password']
      );
    } catch (err) {
      return setSubmitLoading(false);
    }
    LogIn(
      logInWith === 'email'
        ? { logInWith: 'email', email: fields.email, password: fields.password }
        : {
            logInWith: 'username',
            username: fields.username,
            password: fields.password,
          },
      logInAbortController
    )
      .then(() => {
        onLoadProfileData();
      })
      .catch(err => {
        const parsedErr = JSON.parse(err.message);
        if (parsedErr?.message) {
          setError({
            message: parsedErr.message,
            field: parsedErr.field,
          });
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  useEffect(() => {
    setError(null);
  }, [logInWith]);
  return (
    <form className={styles.container} onSubmit={() => handleSubmit}>
      {logInWith === 'username' ? (
        <InputField
          type="text"
          Icon={IconUsername}
          placeholder="username"
          value={fields.username}
          onChange={e => onFieldChange(e, 'username')}
          error={error?.field === 'username'}
          classNameContainer={styles.input}
        />
      ) : (
        <InputField
          Icon={IconEmail}
          type="email"
          placeholder="email"
          value={fields.email}
          onChange={e => onFieldChange(e, 'email')}
          error={error?.field === 'email'}
          classNameContainer={styles.input}
        />
      )}
      <InputField
        type="password"
        Icon={IconPassword}
        placeholder="password"
        value={fields.password}
        onChange={e => onFieldChange(e, 'password')}
        error={error?.field === 'password'}
        classNameContainer={styles.input}
      />
      <div className="">{error && <p>{error.message}</p>}</div>
      <ButtonRounded variant="2" type="submit" loading={submitLoading}>
        Log In
      </ButtonRounded>
      <div className={styles.forgot}>
        <p className={styles.forgotText}>
          Forgot Your {logInWith === 'username' ? 'Username' : 'Email'}? Log in
          with
        </p>
        <button
          type="button"
          className={styles.forgotButton}
          onClick={() =>
            setLogInWith(state => (state === 'username' ? 'email' : 'username'))
          }
        >
          {logInWith === 'email' ? (
            <>
              <IconUsername className={styles.forgotButtonIcon} />
              <span>Username</span>
            </>
          ) : (
            <>
              <IconEmail className={styles.forgotButtonIcon} />
              <span>Email</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default Login;
