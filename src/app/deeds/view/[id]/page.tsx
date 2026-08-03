'use client';

import styles from './styles.module.css';
import { useParams } from 'next/navigation';
import Stepper from '@/components/primitive/stepper/Stepper';

export default function View() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.container}>
      <Stepper id={id}/>
    </div>
  );
}