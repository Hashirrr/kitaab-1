import { FaPlus } from "react-icons/fa6";
import styles from './styles.module.css';
import Draggables from '@/components/composite/draggables/Draggables';

export default function Deeds() {
  return (
    <>
      <Draggables />
      <button className={styles.add__btn__cta}><FaPlus size={16}/>Add New Deed</button>
    </>
  );
};