import clsx from 'clsx';
import styles from './input.module.css';
import { InputProps } from './interface';
import { toSnakeCase } from '@/store/slices/utils';

export default function Input({ label, helper, left, right, className, required, ...props }: InputProps) {

  return (
    <div className={styles.container}>
      <div className={styles.label__wrapper}>
        <label htmlFor={toSnakeCase(label)} className={styles.label}>
          {label}
          {required ? <span className={styles.required}> *</span>: ''}
        </label>

        <div className={styles.helper__text}>{helper}</div>
      </div>

      <div className={styles.input__wrapper}>
        {left && <span className={styles.left__icon}>{left}</span>}

        <input
          {...props}
          id={toSnakeCase(label)}
          className={clsx(
            className,
            styles.input,
            {
              [styles.padding__left]: !!left,
              [styles.padding__right]: !!right,
            }
          )}
        />

        {right && <span className={styles.right__icon}>{right}</span>}
      </div>
    </div>
  );
}