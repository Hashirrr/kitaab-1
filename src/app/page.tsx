'use client';

import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '@/constants/enums';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem(LocalStorage.access_token);
    if (accessToken) router.replace('/dashboard');
    else setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) return null;

  return (
    <div className={styles.container}>
      <button
        type='button'
        className={styles.button}
        onClick={() => router.push('/auth')}
      >
        Get Started
      </button>
    </div>
  );
}