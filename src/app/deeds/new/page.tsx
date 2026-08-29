'use client';

import { useEffect } from 'react';
import styles from './styles.module.css';
import { ModalTypes } from '@/constants/enums';
import Stepper from '@/components/primitive/stepper/Stepper';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentDeedId } from '@/store/slices/selectors';
import { openModal, resetOpenModalStep, setCurrentDeedId } from '@/store/slices/uiSlice';

export default function New() {
  const dispatch = useAppDispatch();
  const currentDeedId = useAppSelector(selectCurrentDeedId);
  useEffect(() => {
    dispatch(openModal(ModalTypes.add_deed));
    return () => {
      dispatch(resetOpenModalStep());
      dispatch(setCurrentDeedId(''));
    };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <Stepper visible={!!currentDeedId}/>
    </div>
  );
};