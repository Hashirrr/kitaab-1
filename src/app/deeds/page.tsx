'use client';

import { FaPlus } from "react-icons/fa6";
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import Draggables from '@/components/composite/draggables/Draggables';

export default function Deeds() {
  const router = useRouter();

  return (
    <>
      <Draggables />
      <button
        className={styles.add__btn__cta}
        onClick={() => router.push('/deeds/new')}
      >
        <FaPlus size={16} />
        <p>Add New Deed</p>
      </button>
    </>
  );
}