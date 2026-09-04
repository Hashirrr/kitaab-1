import styles from './styles.module.css';
import Chart from '@/components/composite/chart';

export default function Dashboard() {
  return (
    <div className={styles.card}>
      <Chart />
    </div>
  );
};