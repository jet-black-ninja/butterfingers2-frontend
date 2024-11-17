import { useContext } from 'react';
import styles from './Stats.module.scss';
import { ProfileContext } from '@/contexts/profile.context';
import { NameAndValue } from '@/components/UI';

function Stats() {
  const { profile } = useContext(ProfileContext);

  return (
    <>
      <div className={styles.testsCountWrapper}>
        <NameAndValue
          name="tests started"
          value={profile.stats.testsStarted || 0}
        />
        <NameAndValue
          name="tests completed"
          value={profile.stats.testsCompleted || 0}
        />
      </div>
      <div className={styles.averageAndHighestWrapper}>
        <div className={styles.testsStatsWrapper}>
          <NameAndValue
            name="highest wpm"
            value={profile.stats.highest?.wpm || 0}
          />
          <NameAndValue
            name="highest accuracy"
            value={(profile.stats.highest?.accuracy || 0) + '%'}
          />
          <NameAndValue
            name="highest raw"
            value={profile.stats.highest?.raw || 0}
          />
        </div>
        <div className={styles.testsStatsWrapper}>
          <NameAndValue
            name="average wpm"
            value={profile.stats.average?.wpm || 0}
          />
          <NameAndValue
            name="average accuracy"
            value={(profile.stats.average?.accuracy || 0) + '%'}
          />
          <NameAndValue
            name="average raw"
            value={profile.stats.average?.raw || 0}
          />
        </div>
      </div>
    </>
  );
}

export default Stats;
