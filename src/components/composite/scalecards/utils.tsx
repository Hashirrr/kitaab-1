import clsx from 'clsx';
import styles from './scalecardscontainer.module.css';
import { PLACEHOLDERS } from '@/constants/placeholders';

const {
  SCALES_CUSTOM,
  SCALES_COUNT_IT,
  SCALES_YES_NO_A,
  SCALES_YES_NO_B,
  SCALES_YES_NO_C,
  SCALES_YES_NO_P,
  SCALES_CUSTOM_P,
  SCALES_YES_NO_H4,
  SCALES_CUSTOM_H4,
  SCALES_COUNT_IT_P,
  SCALES_COUNT_IT_H4,
  SCALES_YES_NO_DEED,
  SCALES_CUSTOM_DEED,
  SCALES_YES_NO_BTN_A,
  SCALES_YES_NO_BTN_B,
  SCALES_CUSTOM_BTN_A,
  SCALES_CUSTOM_BTN_B,
  SCALES_CUSTOM_BTN_C,
  SCALES_CUSTOM_BTN_D,
  SCALES_COUNT_IT_DEED,
  SCALES_COUNT_IT_EXAMPLE
} = PLACEHOLDERS;

export const cards = [
  {
    name: SCALES_COUNT_IT,
    h4: SCALES_COUNT_IT_H4,
    p: SCALES_COUNT_IT_P,
    deed: SCALES_COUNT_IT_DEED,
    example: <p>{SCALES_COUNT_IT_EXAMPLE}</p>
  },
  {
    name: <p><i>{SCALES_YES_NO_A}</i> {SCALES_YES_NO_B} <i>{SCALES_YES_NO_C}</i></p>,
    h4: SCALES_YES_NO_H4,
    p: SCALES_YES_NO_P,
    deed: SCALES_YES_NO_DEED,
    example:
      <div className={styles.btns}>
        <button className={clsx(styles.btn, styles.back)}>{SCALES_YES_NO_BTN_A}</button>
        <button className={clsx(styles.btn, styles.next)}>{SCALES_YES_NO_BTN_B}</button>
      </div>
  },
  {
    name: SCALES_CUSTOM,
    h4: SCALES_CUSTOM_H4,
    p: SCALES_CUSTOM_P,
    deed: SCALES_CUSTOM_DEED,
    example:
      <div className={styles.btns}>
        <button className={clsx(styles.btn, styles.next)}>{SCALES_CUSTOM_BTN_A}</button>
        <button className={clsx(styles.btn, styles.back)}>{SCALES_CUSTOM_BTN_B}</button>
        <button className={clsx(styles.btn, styles.back)}>{SCALES_CUSTOM_BTN_C}</button>
        <button className={clsx(styles.btn, styles.back)}>{SCALES_CUSTOM_BTN_D}</button>
      </div>
  }
];

export const defaultScales = [
  {
    display_order: 1,
    description: null,
    name: SCALES_YES_NO_A
  },
  {
    display_order: 2,
    description: null,
    name: SCALES_YES_NO_C
  }
]