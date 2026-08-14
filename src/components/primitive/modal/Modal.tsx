'use client';

import clsx from 'clsx';
import { motion } from "framer-motion";
import styles from './modal.module.css';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { QUERY } from '@/constants/query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { useFormContext } from '@/store/FormProvider';
import { PLACEHOLDERS } from '@/constants/placeholders';
import Tooltip from '@/components/primitive/tooltip/Tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { useDeleteHasanaatItem, useGetHasanaatItems } from '@/hooks/deeds/hook';
import { selectCurrentDeedId, selectModal, selectOpenModalStep } from '@/store/slices/selectors';
import { ButtonType, Cursor, EventListeners, Form, IconButtonBackground, ModalTypes, Overflow } from '@/constants/enums';
import { backdropCondition, createCloseHandler, getModalPrimaryBtn, getModalSecondaryBtn, getModalTitle, handleKeyDown, isDeedUpdateFormChanged, isDeedUpdateFormChangedTooltip, isForm, modalActionType, onClose, onConfirm } from './utils';

const ANIMATION_DURATION = 250;

export default function Modal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { UNDEFINED } = PLACEHOLDERS;
  const { forms } = useFormContext();
  const deedForm = forms[Form.deed_add];
  const modal = useAppSelector(selectModal);
  const [closing, setClosing] = useState(false);
  const { isOpen, type, error, disabled } = modal;
  const [mounted, setMounted] = useState(isOpen);
  const { deeds_hasanaat, create, update } = QUERY;
  const step = useAppSelector(selectOpenModalStep);
  const deedId = useAppSelector(selectCurrentDeedId);
  const { data: getHasanaatItems } = useGetHasanaatItems();
  const currentDeedId = useAppSelector(selectCurrentDeedId);
  const createHasanaatItemLoading = useIsMutating({ mutationKey: [deeds_hasanaat, create] }) > 0;
  const isUpdateHasanaatItemLoading = useIsMutating({ mutationKey: [deeds_hasanaat, update] }) > 0;
  const { mutateAsync: deleteHasanaatItem, isPending: deleteHasanaatItemLoading } = useDeleteHasanaatItem();
  const currentDeed = getHasanaatItems?.flatMap(deed => [deed, ...(deed.children ?? [])]).find(deed => deed.deed_item_id === currentDeedId);
  const close = useMemo(
    () => createCloseHandler(
      ANIMATION_DURATION,
      closing,
      setClosing,
      setMounted,
      () => onClose(type, step, dispatch, router)
    ),
    [closing, type, dispatch, router, step]
  );
  const deedUpdateFormChanged = isDeedUpdateFormChanged(currentDeed, deedForm?.values);
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      close();
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!mounted) {
      document.body.style.overflow = Overflow.empty;
      return;
    }

    const keyDown: (e: KeyboardEvent) => void = (e) => handleKeyDown(e, close);

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

          <Tooltip content={error || isDeedUpdateFormChangedTooltip(!deedUpdateFormChanged, isUpdateHasanaatItemLoading)}>
            {isForm(type, step) ?
              <button type={ButtonType.submit} form={(type === ModalTypes.add_deed || type === ModalTypes.edit_deed) ? ModalTypes.add_deed: type} className={styles.primary__btn} disabled={disabled || createHasanaatItemLoading || deleteHasanaatItemLoading || isUpdateHasanaatItemLoading || !deedUpdateFormChanged}>
                {getModalPrimaryBtn(type, step, createHasanaatItemLoading, undefined, isUpdateHasanaatItemLoading)}
              </button>:
              <button type={ButtonType.button} className={styles.primary__btn} onClick={() => onConfirm(type, deleteHasanaatItem, dispatch, deedId)} disabled={deleteHasanaatItemLoading}>
                {getModalPrimaryBtn(type, step, undefined, deleteHasanaatItemLoading)}
              </button>
            }
          </Tooltip>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}