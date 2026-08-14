'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { ModalTypes } from '@/constants/enums';
import Stepper from '@/components/primitive/stepper/Stepper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectOpenModalStep } from '@/store/slices/selectors';
import { openModal, resetOpenModalStep } from '@/store/slices/uiSlice';

export default function New() {
  const dispatch = useAppDispatch();
  const step = useAppSelector(selectOpenModalStep);
  useEffect(() => {
    dispatch(openModal(ModalTypes.add_deed));
    return () => {
      dispatch(resetOpenModalStep())
    };
  }, []);

  return (
    <div className={styles.container}>
      <Stepper visible={step !== 1}/>
    </div>
  );
};