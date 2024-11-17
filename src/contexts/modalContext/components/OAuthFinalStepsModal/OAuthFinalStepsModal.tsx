import { ProfileContext } from '@/contexts/profile.context';
import styles from './OAuthFinalStepsModal.module.scss';
import useForm from '@/hooks/useForm';
import { useContext, useState } from 'react';
import { InputField, Modal } from '@/components/UI';
import SubmitForm from '@/components/UI/SubmitForm/SubmitForm';
import { IconUsername } from '@/assets/image';
import { OauthFinalSteps } from '@/api/auth';

export type OAuthFinalStepsModalOptions = {
  platform: 'GitHub' | 'Google';
};
interface Props {
  options: OAuthFinalStepsModalOptions;
  onClose: () => void;
}
function OAuthFinalStepsModal(props: Props) {
  const { options, onClose } = props;
  const { onOauthFinalStepsComplete } = useContext(ProfileContext);
  const { fields, error, onFieldChange, validateEmpty, setError } = useForm([
    'username',
  ]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      validateEmpty();
      OauthFinalSteps(options.platform, fields.username)
        .then(data => {
          if (data.username) {
            onOauthFinalStepsComplete(data.username);
          }
        })
        .catch(err => {
          setError({ message: err.message, field: err.field });
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    } catch (err) {
      setSubmitLoading(false);
    }
  };
  return (
    <Modal
      heading={options.platform}
      onClose={onClose}
      ignoreOutsideClick
      className={styles.modal}
    >
      <p className={styles.paragraph}>
        Enter your username to complete authorization with {options.platform}
      </p>
      <SubmitForm
        className={styles.form}
        errorMessage={error?.message}
        onSubmit={handleFormSubmit}
        submitLoading={submitLoading}
      >
        <InputField
          Icon={IconUsername}
          placeholder="username"
          value={fields.username}
          onChange={e => onFieldChange(e, 'username')}
          error={error?.field === 'username'}
          autoFocus
        />
      </SubmitForm>
    </Modal>
  );
}
export default OAuthFinalStepsModal;
