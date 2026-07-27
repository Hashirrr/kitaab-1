import styles from './styles.module.css';
import Stepper from '@/components/primitive/stepper/Stepper';

export default function New() {
  return (
    <div className={styles.container}><Stepper /></div>
  );
};