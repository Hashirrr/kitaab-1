'use client';

import clsx from 'clsx';
import styles from './stepper.module.css';
import { StepperProps } from './interface';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useGetDeeds } from '@/hooks/deeds/hook';
import { useGetScales } from '@/hooks/scales/hook';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { DraggableCardVariants } from '@/constants/enums';
import { useLayoutEffect, useRef, useState } from 'react';
import { selectCurrentDeedId } from '@/store/slices/selectors';
import Draggables from '@/components/composite/draggables/Draggables';
import ScaleCardsContainer from '@/components/composite/scalecards/ScaleCardsContainer';

export default function Stepper({ id, visible }: StepperProps) {
  const [active, setActive] = useState(0);
  const { data: getDeeds } = useGetDeeds();
  const { data: getScales } = useGetScales();
  const deedRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const [deedHeight, setDeedHeight] = useState(0);
  const [scaleHeight, setScaleHeight] = useState(0);
  const currentDeedId = useAppSelector(selectCurrentDeedId);
  const router = useRouter();
  const targetId = id || currentDeedId;
  const deed = targetId ? getDeeds?.find(item => item.deed_item_id === targetId || item.children?.some(child => child.deed_item_id === targetId)) : undefined;
  const isVisible = visible !== undefined ? visible : !!deed;
  const {
    STEPPER_END,
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

    const resizeObserver = new ResizeObserver(updateHeight);
    Array.from(element.children).forEach((child) => resizeObserver.observe(child));

    const mutationObserver = new MutationObserver(() => {
      updateHeight();
      Array.from(element.children).forEach((child) => resizeObserver.observe(child));
    });

    mutationObserver.observe(element, { childList: true, subtree: true, characterData: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [deed, isVisible, getDeeds]);

  useLayoutEffect(() => {
    const element = scaleRef.current;

    if (!element) return;

    const updateHeight = () => {
      setScaleHeight(element.scrollHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    Array.from(element.children).forEach((child) => resizeObserver.observe(child));

    const mutationObserver = new MutationObserver(() => {
      updateHeight();
      Array.from(element.children).forEach((child) => resizeObserver.observe(child));
    });

    mutationObserver.observe(element, { childList: true, subtree: true, characterData: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [active, getScales]);

  return (
    <div className={styles.container}>
      <div className={styles.step}>
        <div className={clsx(styles.badge, {
          [styles.is__active]: active === 0
        })}>{STEPPER_STEP_1}</div>
        <p className={styles.title}>{STEPPER_DEEDS_MANAGEMENT}</p>
      </div>
      {isVisible ? <div
        ref={deedRef}
        className={clsx(styles.content, {
          [styles.expand]: active === 0
        })}
        style={{ maxHeight: active === 0 ? `${deedHeight}px` : '0px', padding: active === 0 ? '10px' : '0px' }}
      >
        <div className={styles.deeds}>
          <Draggables deedsData={deed ? [deed] : []} variant={DraggableCardVariants.parent} />
          {!!deed?.children?.length && <div className={styles.deeds__children}>
            <Draggables deedsData={deed?.children} variant={DraggableCardVariants.children} />
          </div>}
        </div>
        <div className={styles.btns}>
          <button className={clsx(styles.btn, styles.back)} disabled>{STEPPER_BACK}</button>
          <button className={clsx(styles.btn, styles.next)} onClick={() => setActive(1)}>{STEPPER_NEXT}</button>
        </div>
      </div> :
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
        style={{ maxHeight: active === 1 ? `${scaleHeight}px` : '0px' }}
      >
        <ScaleCardsContainer />
        <div className={styles.btns}>
          <button className={clsx(styles.btn, styles.back)} onClick={() => setActive(0)}>{STEPPER_BACK}</button>
          <button className={clsx(styles.btn, styles.next)} onClick={() => router.back()}>{STEPPER_END}</button>
        </div>
      </div>
    </div>
  );
};