'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Routes } from '@/constants/enums';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(Routes.deeds);
  }, [router]);
  
  return (
    <div></div>
  );
};