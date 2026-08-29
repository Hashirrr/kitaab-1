'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentDeedId } from '@/store/slices/uiSlice';
import Stepper from '@/components/primitive/stepper/Stepper';

export default function View() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(setCurrentDeedId(id));
    }
    return () => {
      dispatch(setCurrentDeedId(''));
    };
  }, [id, dispatch]);

  return (
    <div className={styles.container}>
      <Stepper id={id} visible={true}/>
    </div>
  );
};