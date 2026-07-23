import styles from './modal.module.css';
import { Dispatch, SetStateAction } from 'react';
import { Keys, ModalTypes } from '@/constants/enums';
import { PLACEHOLDERS } from '@/constants/placeholders';

const { MODAL_DELETE_DEED_DESCRIPTION } = PLACEHOLDERS;
export const handleClose = (setClosing: Dispatch<SetStateAction<boolean>>, setMounted: Dispatch<SetStateAction<boolean>>, onClose: () => void) => {
  setClosing(true);

  window.setTimeout(() => {
    setClosing(false);
    setMounted(false);
    onClose();
  }, 220);
};

export const handleKeyDown = (e: KeyboardEvent, close: () => void) => {
  if (e.key === Keys.escape) close();
};

export const modalActionType = (type: string) => {
  switch (type) {
    case ModalTypes.delete_deed:
    default: 
      return (
        <p className={styles.content}>{MODAL_DELETE_DEED_DESCRIPTION}</p>
      );
  }
}