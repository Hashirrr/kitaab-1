'use client';

import clsx from 'clsx';
import styles from './stepper.module.css';
import { StepperProps } from './interface';
import { useGetHasanaatItems } from '@/hooks/deeds/hook';
import { useLayoutEffect, useRef, useState } from 'react';
import { DraggableCardVariants } from '@/constants/enums';
import Draggables from '@/components/composite/draggables/Draggables';

export default function Stepper({ id }: StepperProps) {
  const [active, setActive] = useState(0);
  const deedRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const [deedHeight, setDeedHeight] = useState(0);
  const { data: getHasanaatItemsData } = useGetHasanaatItems();
  const deed = getHasanaatItemsData?.find(item => item.deed_item_id === id);
  
  useLayoutEffect(() => {
    if (!deedRef.current) return;

    const observer = new ResizeObserver(() => {
      setDeedHeight(deedRef.current!.scrollHeight);
    });

    observer.observe(deedRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.step}>
          <div className={clsx(styles.badge, { 
            [styles.is__active]: active === 0
          })}>1</div>
          <p className={styles.title}>Deeds Management</p>
        </div>
        <div
          ref={deedRef}
          className={clsx(styles.content, {
            [styles.expand]: active === 0
          })}
          style={{ maxHeight: active === 0 ? `${deedHeight}px`: '0px', padding: active === 0 ? '10px': '0px' }}
        >
          <div className={styles.deeds}>
            <Draggables deedsData={deed ? [deed] : []} variant={DraggableCardVariants.parent}/>
            {deed?.children && <div className={styles.deeds__children}>
              <Draggables deedsData={deed?.children} variant={DraggableCardVariants.children}/>
            </div>}
          </div>
          <div className={styles.btns}>
            <button className={clsx(styles.btn, styles.back)} disabled>Back</button>
            <button className={clsx(styles.btn, styles.next)} onClick={() => setActive(1) }>Next</button>
          </div>
        </div>
        <div className={styles.step}>
          <div className={clsx(styles.badge, { 
            [styles.is__active]: !(active === 0)
          })}>2</div>
          <p className={styles.title}>Scales Management</p>
        </div>
        <div
          ref={scaleRef}
          className={clsx(styles.content, {
            [styles.expand]: active === 1
          })}
          style={{ maxHeight: active === 1 ? `${scaleRef.current?.scrollHeight}px`: '0px' }}
        >
          <div className={styles.btns}>
            <button className={clsx(styles.btn, styles.back)} onClick={() => setActive(0)}>Back</button>
            <button className={clsx(styles.btn, styles.next)} onClick={() => setActive(2)} disabled>Next</button>
          </div>
        </div>
      </div>
    </>
  );
};