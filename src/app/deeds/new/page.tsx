'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { useAppDispatch } from '@/store/hooks';
import { ModalTypes } from '@/constants/enums';
import { openModal } from '@/store/slices/uiSlice';
import Stepper from '@/components/primitive/stepper/Stepper';

export default function New() {
  const dispatch = useAppDispatch();
  
  useEffect(()=> {
    dispatch(openModal(ModalTypes.add_deed));
  }, []);

  return (
    <div className={styles.container}><Stepper id={"102"} /></div>
  );
};