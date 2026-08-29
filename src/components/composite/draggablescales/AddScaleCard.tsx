'use client';

import { FaPlus } from 'react-icons/fa6';
import { ModalTypes } from '@/constants/enums';
import { useAppDispatch } from '@/store/hooks';
import styles from './addscalecard.module.css';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { openModal, resetOpenModalStep } from '@/store/slices/uiSlice';

export default function AddScaleCard() {
  const dispatch = useAppDispatch();
  const { ADD_SCALE_CTA } = PLACEHOLDERS;

  const handleAddScale = () => {
    dispatch(resetOpenModalStep());
    dispatch(openModal(ModalTypes.add_scale));
  };

  return (
    <button
      type="button"
      className={styles.card}
      onClick={handleAddScale}
      aria-label={ADD_SCALE_CTA}
    >
      <div className={styles.icon__container}>
        <FaPlus size={18} />
      </div>
      <p className={styles.label}>{ADD_SCALE_CTA}</p>
    </button>
  );
}
