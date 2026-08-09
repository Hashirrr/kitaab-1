'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { ModalTypes } from '@/constants/enums';
import { openModal } from '@/store/slices/uiSlice';
import Stepper from '@/components/primitive/stepper/Stepper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectOpenModalStep } from '@/store/slices/selectors';

export default function New() {
  const dispatch = useAppDispatch();
  const step = useAppSelector(selectOpenModalStep);
  useEffect(()=> {
    dispatch(openModal(ModalTypes.add_deed));
  }, []);

  return (
    <div className={styles.container}>
      <Stepper visible={step !== 1}/>
    </div>
  );
};