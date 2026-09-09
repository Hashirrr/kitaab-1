'use client';

import clsx from 'clsx';
import styles from './checkbox.module.css';
import { CheckboxProps } from './interface';
import Skeleton from '../skeleton/Skeleton';
import { toSnakeCase } from '@/store/slices/utils';
import { HTMLAttributeType } from '@/constants/enums';

export default function Checkbox({ id, label, helper, skeleton, skeletonWidth, disabled, className, required, children, ...props }: CheckboxProps) {
  const content = label ?? children;
  const inputId = id || (typeof content === 'string' ? toSnakeCase(content).replace(/[^a-z0-9_-]/g, '') : undefined);

  if (skeleton) {
    return (
      <div className={clsx(styles.container, styles.skeleton__container, className)}>
        <Skeleton width={18} height={18} borderRadius={4} />
        <Skeleton width={skeletonWidth ?? 70} height={14} borderRadius={4} />
      </div>
    );
  }

  return (
    <label
      htmlFor={inputId}
      className={clsx(styles.container, className, {
        [styles.disabled]: disabled,
      })}
    >
      <div className={styles.checkbox__wrapper}>
        <input
          {...props}
          id={inputId}
          disabled={disabled}
          type={HTMLAttributeType.checkbox}
          className={styles.native__checkbox}
        />
        <span className={styles.custom__checkbox}>
          <svg
            className={styles.checkmark}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
}