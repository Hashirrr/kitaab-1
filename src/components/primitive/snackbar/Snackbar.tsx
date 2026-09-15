'use client';

import { createPortal } from 'react-dom';
import { getVariantIcon } from './utils';
import { FaXmark } from 'react-icons/fa6';
import styles from './snackbar.module.css';
import { SnackbarProps } from './interface';
import { closeSnackbar } from '@/store/slices/uiSlice';
import { useEffect, useSyncExternalStore } from 'react';
import { selectSnackbar } from '@/store/slices/selectors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const emptySubscribe = () => () => {};

export default function Snackbar(props: SnackbarProps = {}) {
  const dispatch = useAppDispatch();
  const globalSnackbar = useAppSelector(selectSnackbar);
  
  const action = props.action;
  const open = props.open ?? globalSnackbar.open;
  const message = props.message ?? globalSnackbar.message;
  const variant = props.variant ?? globalSnackbar.variant;
  const duration = props.duration ?? globalSnackbar.duration ?? 4000;
  const onClose = props.onClose ?? (() => dispatch(closeSnackbar()));
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!open || duration <= 0 || !onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!isMounted || !open || !message) return null;

  return createPortal(
    <div className={styles.snackbar} role='alert' aria-live='assertive'>
      {getVariantIcon(variant)}
      <div className={styles.message}>{message}</div>
      {action && <div className={styles.action}>{action}</div>}
      {onClose && (
        <button
          type='button'
          className={styles.close__btn}
          onClick={onClose}
          aria-label='Close notification'
        >
          <FaXmark size={14} />
        </button>
      )}
    </div>,
    document.body
  );
}