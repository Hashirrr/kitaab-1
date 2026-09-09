'use client';

import clsx from 'clsx';
import styles from './radio.module.css';
import { RadioProps } from './interface';
import Skeleton from '../skeleton/Skeleton';
import { toSnakeCase } from '@/store/slices/utils';
import { HTMLAttributeType } from '@/constants/enums';

export default function Radio({ id, label, helper, skeleton, skeletonWidth, disabled, className, required, children, ...props }: RadioProps) {
  const content = label ?? children;
  const inputId = id || (typeof content === 'string' ? toSnakeCase(content).replace(/[^a-z0-9_-]/g, '') : undefined);

  if (skeleton) {
    return (
      <div className={clsx(styles.container, styles.skeleton__container, className)}>
        <Skeleton width={18} height={18} borderRadius="50%" />
        <Skeleton width={skeletonWidth ?? 70} height={14} borderRadius={4} />
      </div>
    );
  }

  return (
    <label
      htmlFor={inputId}
      className={clsx(styles.container, className, {
        [styles.disabled]: disabled,
        [styles.checked]: Boolean(props.checked),
      })}
    >
      <div className={styles.radio__wrapper}>
        <input
          {...props}
          id={inputId}
          disabled={disabled}
          type={HTMLAttributeType.radio}
          className={styles.native__radio}
        />
        <span className={styles.custom__radio}>
          <span className={styles.radio__dot} />
        </span>
      </div>

      {content && (
        <div className={styles.label__wrapper}>
          <span className={styles.label}>
            {content}
            {required && <span className={styles.required}> *</span>}
          </span>
          {helper && <span className={styles.helper__text}>{helper}</span>}
        </div>
      )}
    </label>
  );
};