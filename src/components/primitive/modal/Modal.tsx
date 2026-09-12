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
import { useDeleteDeed, useGetDeeds } from '@/hooks/deeds/hook';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { useDeleteScaleItem, useGetScales, useUpdateScaleType, useCreateScales } from '@/hooks/scales/hook';
import { ButtonType, Cursor, EventListeners, Form, IconButtonBackground, ModalTypes, Overflow } from '@/constants/enums';
import { selectCurrentDeedId, selectCurrentScaleId, selectModal, selectOpenModalStep, selectPendingScaleCardIndex } from '@/store/slices/selectors';
import { backdropCondition, createCloseHandler, getModalPrimaryBtn, getModalSecondaryBtn, getModalTitle, handleKeyDown, isDeedUpdateFormChanged, isDeedUpdateFormChangedTooltip, isForm, isScaleUpdateFormChanged, modalActionType, onClose, onConfirm } from './utils';

const ANIMATION_DURATION = 250;

export default function Modal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { UNDEFINED } = PLACEHOLDERS;
  const { forms } = useFormContext();
  const deedForm = forms[Form.deed_add];
  const scaleForm = forms[Form.scale_edit];
  const { data: getDeeds } = useGetDeeds();
  const { data: getScales } = useGetScales();
  const modal = useAppSelector(selectModal);
  const [closing, setClosing] = useState(false);
  const { deeds, scales, create, update } = QUERY;
  const { isOpen, type, error, disabled } = modal;
  const [mounted, setMounted] = useState(isOpen);
  const step = useAppSelector(selectOpenModalStep);
  const currentDeedId = useAppSelector(selectCurrentDeedId);
  const currentScaleItemId = useAppSelector(selectCurrentScaleId);
  const isCreateDeedPending = useIsMutating({ mutationKey: [deeds, create] }) > 0;
  const isUpdateDeedPending = useIsMutating({ mutationKey: [deeds, update] }) > 0;
  const isCreateScalePending = useIsMutating({ mutationKey: [scales, create] }) > 0;
  const isUpdateScalePending = useIsMutating({ mutationKey: [scales, update] }) > 0;
  const { mutateAsync: deleteDeed, isPending: isDeleteDeedPending } = useDeleteDeed();
  const { mutateAsync: deleteScale, isPending: isDeleteScalePending } = useDeleteScaleItem();
  const currentDeed = getDeeds?.flatMap(deed => [deed, ...(deed.children ?? [])]).find(deed => deed.deed_item_id === currentDeedId);
  const currentScale = getScales?.find(scale => scale.scale_items_id === currentScaleItemId);
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
  const pendingScaleCardIndex = useAppSelector(selectPendingScaleCardIndex);
  const deedUpdateFormChanged = isDeedUpdateFormChanged(currentDeed, deedForm?.values);
  const scaleUpdateFormChanged = isScaleUpdateFormChanged(currentScale, scaleForm?.values);
  const { mutateAsync: createScales, isPending: isCreateScalesMutationPending } = useCreateScales();
  const { mutateAsync: updateScaleType, isPending: isUpdateScaleTypePending } = useUpdateScaleType();
  const isScaleWarningPending = isUpdateScaleTypePending || isCreateScalesMutationPending;
  const isFormChanged = type === ModalTypes.edit_scale ? scaleUpdateFormChanged : (type === ModalTypes.edit_deed ? deedUpdateFormChanged : true);
  const isUpdatePending = type === ModalTypes.edit_scale ? isUpdateScalePending : (type === ModalTypes.add_scale ? isCreateScalePending : isUpdateDeedPending);
  const isDeletePending = type === ModalTypes.delete_scale ? isDeleteScalePending : (type === ModalTypes.delete_deed ? isDeleteDeedPending : (type === ModalTypes.scale_type_warning ? isScaleWarningPending : false));

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) close();
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

          <Tooltip content={error || isDeedUpdateFormChangedTooltip(!isFormChanged, isUpdatePending)}>
            {isForm(type, step) ?
              <button
                type={ButtonType.submit}
                className={styles.primary__btn}
                disabled={disabled || isCreateDeedPending || isCreateScalePending || isDeleteDeedPending || isUpdateDeedPending || isUpdateScalePending || isDeleteScalePending || !isFormChanged}
                form={(type === ModalTypes.add_deed || type === ModalTypes.edit_deed) ? ModalTypes.add_deed : ((type === ModalTypes.edit_scale || type === ModalTypes.add_scale) ? ModalTypes.edit_scale : type)}
              >
                {getModalPrimaryBtn(type, step, isCreateDeedPending, isDeleteDeedPending, isUpdateDeedPending, isUpdateScalePending, isDeleteScalePending, isCreateScalePending)}
              </button> :
              <button
                type={ButtonType.button}
                disabled={isDeletePending}
                className={styles.primary__btn}
                onClick={() => onConfirm(type, deleteDeed, deleteScale, dispatch, updateScaleType, createScales, pendingScaleCardIndex)}
              >
                {getModalPrimaryBtn(type, step, undefined, isDeleteDeedPending, undefined, undefined, isDeleteScalePending, undefined, isScaleWarningPending)}
              </button>
            }
          </Tooltip>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}