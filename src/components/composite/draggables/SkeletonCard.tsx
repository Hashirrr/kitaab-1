import styles from './skeletoncard.module.css';
import Skeleton from '@/components/primitive/skeleton/Skeleton';

export default function SkeletonCard() {
  const skeletonTitle = <Skeleton height={30} width={110} borderRadius={5}/>
  const skeletonIconButton = <Skeleton height={40} width={45} borderRadius={5}/>
  const skeletonButton = <Skeleton height={40} width={`100%`} borderRadius={5}/>
  const skeletonValues = (width: number) => <Skeleton height={20} width={width} borderRadius={5}/>
  
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{skeletonTitle}</h3>
      <hr className={styles.fading__line} />
      <dl className={styles.key__values}>
        <dt>{skeletonValues(96)}</dt>
        <dd>{skeletonValues(84)}</dd>
        <dt>{skeletonValues(82)}</dt>
        <dd>{skeletonValues(102)}</dd>
        <dt>{skeletonValues(104)}</dt>
        <dd>{skeletonValues(90)}</dd>
        <dt>{skeletonValues(74)}</dt>
        <dd>{skeletonValues(112)}</dd>
      </dl>

      <div className={styles.btn__container}>
        {skeletonButton}
        {skeletonIconButton}
        {skeletonIconButton}
      </div>
    </div>
  );
};