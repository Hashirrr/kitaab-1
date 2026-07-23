'use client';

import { FaPlus } from "react-icons/fa6";
import styles from './styles.module.css';
import { handleAddNewDeed } from "./utils";
import { useRouter } from 'next/navigation';
import { useAppDispatch } from "@/store/hooks";
import Draggables from '@/components/composite/draggables/Draggables';

export default function Deeds() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <>
      <Draggables />
      <button className={styles.add__btn__cta} onClick={() => handleAddNewDeed(router, dispatch)}>
        <FaPlus size={16} />
        <p>Add New Deed</p>
      </button>
    </>
  );
}