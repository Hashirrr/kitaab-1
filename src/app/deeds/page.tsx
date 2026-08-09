'use client';

import { FaPlus } from 'react-icons/fa6';
import styles from './styles.module.css';
import { handleAddNewDeed } from './utils';
import { useRouter } from 'next/navigation';
import { useGetHasanaatItems } from '@/hooks/deeds/hook';
import Draggables from '@/components/composite/draggables/Draggables';

export default function Deeds() {
  const router = useRouter();
  const { data: getHasanaatItemsData } = useGetHasanaatItems();

  return (
    <>
      <Draggables deedsData={getHasanaatItemsData} />
      <button className={styles.add__btn__cta} onClick={() => handleAddNewDeed(router)}>
        <FaPlus size={16} />
        <p>Add New Deed</p>
      </button>
    </>
  );
};