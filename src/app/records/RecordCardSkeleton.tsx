'use client';

import styles from './recordcards.module.css';
import Skeleton from '@/components/primitive/skeleton/Skeleton';

export default function RecordCardSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.single__deed__row}>
            <Skeleton height={26} width={120} borderRadius={5} />
            <div className={styles.mcq__group}>
              <Skeleton height={34} width={102} borderRadius={6} />
              <Skeleton height={34} width={102} borderRadius={6} />
              <Skeleton height={34} width={102} borderRadius={6} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
