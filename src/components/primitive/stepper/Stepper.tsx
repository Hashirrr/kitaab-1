'use client';

import clsx from 'clsx';
import styles from './stepper.module.css';
import { StepperProps } from './interface';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { useGetHasanaatItems } from '@/hooks/deeds/hook';
import { useLayoutEffect, useRef, useState } from 'react';
import { DraggableCardVariants } from '@/constants/enums';
import Draggables from '@/components/composite/draggables/Draggables';

export default function Stepper({ id, visible }: StepperProps) {
  const [active, setActive] = useState(0);
  const deedRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const [deedHeight, setDeedHeight] = useState(0);
  const { data: getHasanaatItemsData } = useGetHasanaatItems();
  const deed = id ? getHasanaatItemsData?.find((item) => item.deed_item_id === id): getHasanaatItemsData?.at(-1);
  const {
    STEPPER_NEXT,
    STEPPER_BACK,
    STEPPER_STEP_1,
    STEPPER_STEP_2,
    STEPPER_NO_DEEDS,
    STEPPER_DEEDS_MANAGEMENT,
    STEPPER_SCALES_MANAGEMENT
  } = PLACEHOLDERS;
  useLayoutEffect(() => {
    const element = deedRef.current;

    if (!element) return;

    const updateHeight = () => {
      setDeedHeight(element.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [deed, visible]);

  return (
    <div className={styles.container}>
      <div className={styles.step}>
        <div className={clsx(styles.badge, { 
          [styles.is__active]: active === 0
        })}>{STEPPER_STEP_1}</div>
        <p className={styles.title}>{STEPPER_DEEDS_MANAGEMENT}</p>
      </div>
      {visible? <div
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
          <button className={clsx(styles.btn, styles.back)} disabled>{STEPPER_BACK}</button>
          <button className={clsx(styles.btn, styles.next)} onClick={() => setActive(1) }>{STEPPER_NEXT}</button>
        </div>
      </div>:
      <p className={styles.text}>{STEPPER_NO_DEEDS}</p>}
      <div className={styles.step}>
        <div className={clsx(styles.badge, { 
          [styles.is__active]: !(active === 0)
        })}>{STEPPER_STEP_2}</div>
        <p className={styles.title}>{STEPPER_SCALES_MANAGEMENT}</p>
      </div>
      <div
        ref={scaleRef}
        className={clsx(styles.content, {
          [styles.expand]: active === 1
        })}
        style={{ maxHeight: active === 1 ? `${scaleRef.current?.scrollHeight}px`: '0px' }}
      >
        <div className={styles.btns}>
          <button className={clsx(styles.btn, styles.back)} onClick={() => setActive(0)}>{STEPPER_BACK}</button>
          <button className={clsx(styles.btn, styles.next)} onClick={() => setActive(2)} disabled>{STEPPER_NEXT}</button>
        </div>
      </div>
    </div>
  );
};