'use client';

import clsx from 'clsx';
import { useState } from 'react';
import styles from './stepper.module.css';

export default function Stepper() {
  const [active, setActive] = useState(true)
  return (
    <>
      <div className={styles.container}>
        <div className={styles.step}>
          <div className={clsx(styles.badge, { 
            [styles.is__active]: active
          })}>1</div>
          <p className={styles.title}>Deeds Management</p>
        </div>
        <div className={clsx(styles.content, {
          [styles.expand]: active
        })}></div>
        <div className={styles.step}>
          <div className={clsx(styles.badge, { 
            [styles.is__active]: !active
          })}>2</div>
          <p className={styles.title}>Scales Management</p>
        </div>
        <div className={clsx(styles.content, {
          [styles.expand]: !active
        })}></div>
        <div className={styles.step}>
          <div className={clsx(styles.badge)}>3</div>
          <p className={styles.title}>Achievements Management</p>
        </div>
      </div>
      <button style={{ width: '30px', margin: '50px' }} onClick={() => setActive(prev => !prev)}>A</button>
    </>
  );
};