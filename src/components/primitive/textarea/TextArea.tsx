'use client';

import clsx from 'clsx';
import { useRef } from 'react';
import { handleInput } from './utils';
import styles from './textarea.module.css';
import { TextareaProps } from './interface';
import { toSnakeCase } from '@/store/slices/utils';

export default function Textarea({ label, helper, left, right, className, onInput, ...props }: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={styles.container}>
      <div className={styles.label__wrapper}>
        <label htmlFor={toSnakeCase(label)} className={styles.label}>
          {label}
        </label>

        <div className={styles.helper__text}>{helper}</div>
      </div>

      <div className={styles.input__wrapper}>
        {left && <span className={styles.left__icon}>{left}</span>}

        <textarea
          rows={1}
          {...props}
          ref={textareaRef}
          id={toSnakeCase(label)}
          className={clsx(
            styles.input,
            className,
            {
              [styles.padding__left]: !!left,
              [styles.padding__right]: !!right,
            }
          )}
          onInput={(e) => { handleInput(e); onInput?.(e); }}
        />

        {right && <span className={styles.right__icon}>{right}</span>}
      </div>
    </div>
  );
}