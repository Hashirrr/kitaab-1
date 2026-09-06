'use client';

import { LuPlus } from 'react-icons/lu';
import styles from './styles.module.css';
import { handleAddNewDeed } from './utils';
import { useRouter } from 'next/navigation';
import { useGetDeeds } from '@/hooks/deeds/hook';
import { PLACEHOLDERS } from '@/constants/placeholders';
import Draggables from '@/components/composite/draggables/Draggables';

export default function Deeds() {
  const router = useRouter();
  const { ADD_DEED_CTA } = PLACEHOLDERS;
  const { data: getDeeds } = useGetDeeds();
  return (
    <>
      <Draggables deedsData={getDeeds} />
      <button className={styles.add__btn__cta} onClick={() => handleAddNewDeed(router)}>
        <LuPlus size={18} />
        <p>{ADD_DEED_CTA}</p>
      </button>
    </>
  );
};