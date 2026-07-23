'use client';

import clsx from 'clsx';
import styles from './modal.module.css';
import { createPortal } from 'react-dom';
import { ModalProps } from './interface';
import { IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { handleKeyDown, modalActionType } from './utils';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { Cursor, EventListeners, IconButtonBackground, Overflow } from '@/constants/enums';

const ANIMATION_DURATION = 250;

export default function Modal({ isOpen, onClose, onConfirm, title, type, primaryBtn, secondaryBtn, closeOnBackdrop = true }: ModalProps) {
  const { UNDEFINED } = PLACEHOLDERS;

  const [mounted, setMounted] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  const close = () => {
    if (closing) return;

    setClosing(true);

    setTimeout(() => {
      setMounted(false);
      setClosing(false);
      onClose?.();
    }, ANIMATION_DURATION);
  };

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      document.body.style.overflow = Overflow.hidden;
    } else if (mounted) {
      setClosing(true);

      const timer = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
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
  }, [mounted]);

  if (!mounted || typeof window === UNDEFINED) return null;

  return createPortal(
    <div
      className={clsx(styles.backdrop, {
        [styles.backdrop__closing]: closing,
      })}
      onClick={closeOnBackdrop ? close : undefined}
    >
      <div
        className={clsx(styles.modal, {
          [styles.slide__up]: !closing,
          [styles.slide__down]: closing,
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div />
          <h3>{title}</h3>

          <IconButton
            cursor={Cursor.pointer}
            icon={<IoClose size={20} />}
            variant={IconButtonBackground.primary}
            onClick={close}
          />
        </div>

        <hr className={styles.fading__line} />

        {modalActionType(type)}

        <div className={styles.footer}>
          <button className={styles.secondary__btn} onClick={close}>
            {secondaryBtn}
          </button>

          <button className={styles.primary__btn} onClick={onConfirm}>
            {primaryBtn}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};