import { FaBell } from 'react-icons/fa';
import styles from './notifications.module.css';
import { PLACEHOLDERS } from '@/constants/placeholders';

export default function Notifications() {
  const { NO_NOTIFICATIONS_TITLE, NO_NOTIFICATIONS_DESCRIPTION } = PLACEHOLDERS;

  return (
    <div className={styles.container}>
      <div className={styles.empty__state}>
        <div className={styles.icon__wrapper}>
          <FaBell className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{NO_NOTIFICATIONS_TITLE}</h3>
          <p className={styles.description}>{NO_NOTIFICATIONS_DESCRIPTION}</p>
        </div>
      </div>
    </div>
  );
};