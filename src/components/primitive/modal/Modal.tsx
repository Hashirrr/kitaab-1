'use client';

import clsx from 'clsx';
import { motion } from "framer-motion";
import styles from './modal.module.css';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PLACEHOLDERS } from '@/constants/placeholders';
import Tooltip from '@/components/primitive/tooltip/Tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { selectModal, selectOpenModalStep } from '@/store/slices/selectors';
import { incementOpenModalStep, resetOpenModalStep } from '@/store/slices/uiSlice';
import { ButtonType, Cursor, EventListeners, IconButtonBackground, Overflow } from '@/constants/enums';
import { backdropCondition, createCloseHandler, getModalPrimaryBtn, getModalSecondaryBtn, getModalTitle, handleKeyDown, isForm, modalActionType, onClose, onConfirm, useOnConfirmDeleteDeed } from './utils';

const ANIMATION_DURATION = 250;

export default function Modal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { UNDEFINED } = PLACEHOLDERS;
  const modal = useAppSelector(selectModal);
  const [closing, setClosing] = useState(false);
  const { isOpen, type, error, disabled } = modal;
  const [mounted, setMounted] = useState(isOpen);
  const step = useAppSelector(selectOpenModalStep);
  const onConfirmDeleteDeed = useOnConfirmDeleteDeed(dispatch);
  const close = useMemo(
    () => createCloseHandler(ANIMATION_DURATION, closing, setClosing, setMounted, () => onClose(type, step, dispatch, router)),
    [closing, type, dispatch, router, step]
  );

  useEffect(() => {
    if (isOpen) {
      dispatch(resetOpenModalStep());
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) {
      document.body.style.overflow = Overflow.empty;
      return;
    }

    const keyDown = (e: KeyboardEvent) => handleKeyDown(e, close);

    window.addEventListener(EventListeners.keydown, keyDown);

    return () => {
      document.body.style.overflow = Overflow.empty;
      window.removeEventListener(EventListeners.keydown, keyDown);
    };
  }, [mounted, close]);

  if (!mounted || typeof window === UNDEFINED) {
    return null;
  }

  return createPortal(
    <div
      className={clsx(styles.backdrop, {
        [styles.backdrop__closing]: closing,
      })}
      onClick={backdropCondition(type, step) ? close : undefined}
    >
      <motion.div
        className={clsx(styles.modal, {
          [styles.slide__up]: !closing,
          [styles.slide__down]: closing,
        })}
        layout
        onClick={(e) => e.stopPropagation()}
        transition={{ layout: { duration: 0.3 } }}
      >
        <div className={styles.header}>
          <div />

          <h3>{getModalTitle(type, step)}</h3>

          <IconButton
            onClick={close}
            cursor={Cursor.pointer}
            icon={<IoClose size={20} />}
            variant={IconButtonBackground.primary}
          />
        </div>

        <hr className={styles.fading__line} />

        {modalActionType(type, step)}

        <div className={styles.footer}>
          <button type={ButtonType.button} className={styles.secondary__btn} onClick={close}>
            {getModalSecondaryBtn(type, step)}
          </button>

          <Tooltip content={error}>
            {isForm(type, step) ?
              <button type={ButtonType.submit} form={type} className={styles.primary__btn} disabled={disabled}>
                {getModalPrimaryBtn(type, step)}
              </button>:
              <button type={ButtonType.button} className={styles.primary__btn} onClick={() => onConfirm(type, onConfirmDeleteDeed, dispatch, incementOpenModalStep)}>
                {getModalPrimaryBtn(type, step)}
              </button>
            }
          </Tooltip>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}