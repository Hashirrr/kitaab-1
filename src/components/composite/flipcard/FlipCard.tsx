'use client';

import clsx from 'clsx';
import { Children, isValidElement, ReactNode } from 'react';
import styles from './flipcard.module.css';
import { FlipCardProps, FlipCardSideProps } from './interface';

export function FlipCardFront({ children, className }: FlipCardSideProps) {
  return (
    <div className={clsx(styles.card__face, styles.front, className)}>
      {children}
    </div>
  );
}
FlipCardFront.displayName = 'FlipCardFront';

export function FlipCardBack({ children, className }: FlipCardSideProps) {
  return (
    <div className={clsx(styles.card__face, styles.back, className)}>
      {children}
    </div>
  );
}
FlipCardBack.displayName = 'FlipCardBack';

export default function FlipCard({ children, isFlipped = false, className }: FlipCardProps) {
  const childArray = Children.toArray(children);
  const hasSideComponents = childArray.some(
    (child) =>
      isValidElement(child) &&
      ((child.type as any)?.displayName === 'FlipCardFront' ||
        (child.type as any)?.displayName === 'FlipCardBack')
  );

  let content: ReactNode = null;
  if (hasSideComponents) {
    content = children;
  } else if (childArray.length >= 2) {
    content = (
      <>
        <FlipCardFront>{childArray[0]}</FlipCardFront>
        <FlipCardBack>{childArray[1]}</FlipCardBack>
      </>
    );
  } else {
    content = children;
  }

  return (
    <div
      className={clsx(
        styles.card__container,
        {
          [styles.flipped]: isFlipped,
        },
        className
      )}
    >
      <div className={styles.card__inner}>{content}</div>
    </div>
  );
}

FlipCard.Front = FlipCardFront;
FlipCard.Back = FlipCardBack;
