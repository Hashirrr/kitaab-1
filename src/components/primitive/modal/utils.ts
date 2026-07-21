import { Keys } from '@/constants/enums';
import { Dispatch, SetStateAction } from 'react';

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