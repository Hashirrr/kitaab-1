'use client';

import dayjs from 'dayjs';
import { closeModal } from './uiSlice';
import { Mode } from '@/constants/enums';
import { deleteDeedByID } from '@/app/deeds/utils';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectModal, selectViewportWidth } from '@/store/slices/selectors';

export const useIsMobile = () => {
  const width = useAppSelector(selectViewportWidth);
  return width <= 768;
}

export const useOnConfirm = () => {
  const dispatch = useAppDispatch();
  const modal = useAppSelector(selectModal);

  return () => {
    deleteDeedByID(modal.deedId);
    dispatch(closeModal());
  };
};

export const toggleTheme = (setMode: React.Dispatch<React.SetStateAction<Mode>>) => {
  document.documentElement.classList.toggle('dark');
  setMode(prev => (prev === Mode.light ? Mode.dark : Mode.light));
};

dayjs.extend(relativeTime);
export const fromNow = (date: string | Date) => dayjs(date).fromNow();