import { AppDispatch } from '@/store';
import styles from './modal.module.css';
import { Dispatch, SetStateAction } from 'react';
import { DeedItem } from '@/hooks/deeds/interface';
import DeedAddForm from '@/form/deedadd/DeedAddForm';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { DeedAddFormValues } from '@/form/deedadd/interface';
import { Keys, ModalCTA, ModalTypes } from '@/constants/enums';
import { closeModal, incementOpenModalStep } from '@/store/slices/uiSlice';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const {
  MODAL_ADD_DEED_TITLE,
  MODAL_DELETE_DEED_TITLE,
  MODAL_ADD_SUB_DEED_TITLE,
  DEED_UPDATE_FORM_TOOLTIP,
  MODAL_VIEW_EDIT_DEED_TITLE,
  MODAL_DELETE_DEED_DESCRIPTION,
  MODAL_ADD_SUB_DEED_QUESTION_TITLE,
  MODAL_ADD_SUB_DEED_QUESTION_DESCRIPTION,
  MODAL_ADD_SUB_DEED_ANOTHER_QUESTION_TITLE
} = PLACEHOLDERS;

export const createCloseHandler = (duration: number, closing: boolean, setClosing: Dispatch<SetStateAction<boolean>>, setMounted: Dispatch<SetStateAction<boolean>>, onClose: () => void) => {
  return () => {
    if (closing) return;

    setClosing(true);

    window.setTimeout(() => {
      setClosing(false);
      setMounted(false);
      onClose();
    }, duration);
  };
};

export const handleKeyDown = (e: KeyboardEvent, close: () => void) => {
  if (e.key === Keys.escape) {
    close();
  }
};

export const getModalTitle = (type: string, step: number) => {
  switch (type) {
    case ModalTypes.add_deed:
      switch (step % 2) {
        case 1:
          if (step === 1) {
            return MODAL_ADD_DEED_TITLE;
          }
          return MODAL_ADD_SUB_DEED_TITLE;
        case 0:
          if (step === 2) {
            return MODAL_ADD_SUB_DEED_QUESTION_TITLE;
          }
          return MODAL_ADD_SUB_DEED_ANOTHER_QUESTION_TITLE;
        default:
          return;
      }
    case ModalTypes.delete_deed:
      return MODAL_DELETE_DEED_TITLE;
    case ModalTypes.edit_deed:
      return MODAL_VIEW_EDIT_DEED_TITLE;
    default:
      return;
  }
};

export const modalActionType = (type: string, step: number) => {
  switch (type) {
    case ModalTypes.add_deed:
      switch (step % 2) {
        case 1:
          return <DeedAddForm />;
        case 0:
          return <p className={styles.content}>{MODAL_ADD_SUB_DEED_QUESTION_DESCRIPTION}</p>;
        default:
          return;
      }
    case ModalTypes.edit_deed:
      return <DeedAddForm />;
    case ModalTypes.delete_deed:
      return <p className={styles.content}>{MODAL_DELETE_DEED_DESCRIPTION}</p>;
    default:
      return;
  }
};

export const getModalPrimaryBtn = (type: string, step: number, isCreateDeedPending?: boolean, isDeleteDeedPending?: boolean, isUpdateDeedPending?: boolean) => {
  switch (type) {
    case ModalTypes.add_deed:
      switch (step % 2) {
        case 1:
          return isCreateDeedPending ? ModalCTA.adding: ModalCTA.add;
        case 0:
          return ModalCTA.yes;
        default:
          return;
      }
    case ModalTypes.delete_deed:
      return isDeleteDeedPending ? ModalCTA.deleting: ModalCTA.delete;
    case ModalTypes.edit_deed:
      return isUpdateDeedPending ? ModalCTA.updating: ModalCTA.update;
    default:
      return;
  }
};

export const getModalSecondaryBtn = (type: string, step: number) => {
  switch (type) {
    case ModalTypes.add_deed:
      if (step === 1)
        return ModalCTA.back;
      switch (step % 2) {
        case 1:
          return ModalCTA.cancel;
        case 0:
          return ModalCTA.no;
        default:
          return;
      }
    case ModalTypes.delete_deed:
      return ModalCTA.cancel;
    case ModalTypes.edit_deed:
      return ModalCTA.back;
    default:
      return;
  }
};

export const isForm = (type: string, step: number) => {
  switch (type) {
    case ModalTypes.add_deed:
      return step % 2 === 1;
    case ModalTypes.edit_deed:
      return true;
    default:
    case ModalTypes.delete_deed:
      return false;
  }
}

export const onClose = (type: string, step: number, dispatch: AppDispatch, router: AppRouterInstance) => {
  switch (type) {
    case ModalTypes.edit_deed:
    case ModalTypes.delete_deed:
      dispatch(closeModal());
      return;
    case ModalTypes.add_deed:
      dispatch(closeModal());
      if (step === 1) {
        router.back();
      }
      return;
    default:
      return;
  }
};

export const onConfirm = async (type: string, deleteDeed: () => void, dispatch: AppDispatch) => {
  switch (type) {
    case ModalTypes.delete_deed:
      await deleteDeed();
      dispatch(closeModal());
      return;
    case ModalTypes.add_deed:
      dispatch(incementOpenModalStep());
      return;
    default:
      return;
  }
};

export const backdropCondition = (type: string, step: number) => !(type === ModalTypes.add_deed && step === 1);

export const isDeedUpdateFormChanged = (currentDeed: DeedItem | undefined, values: DeedAddFormValues) => {
  if (currentDeed?.name != values?.name || (currentDeed?.description || '') != (values?.description || ''))
    return true;
  return false;
};

export const isDeedUpdateFormChangedTooltip = (deedUpdateFormChanged: boolean, isUpdateDeedPending?: boolean) => {
  return deedUpdateFormChanged && !isUpdateDeedPending ? DEED_UPDATE_FORM_TOOLTIP: ''
};