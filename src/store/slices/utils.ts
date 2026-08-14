'use client';

import dayjs from 'dayjs';
import { Mode } from '@/constants/enums';
import { useAppSelector } from '@/store/hooks';
import relativeTime from 'dayjs/plugin/relativeTime';
import { selectViewportWidth } from '@/store/slices/selectors';

export const useIsMobile = () => {
  const width = useAppSelector(selectViewportWidth);
  return width <= 768;
}

export const useIsTablet = () => {
  const width = useAppSelector(selectViewportWidth);
  return width <= 1024;
}

export const toggleTheme = (setMode: React.Dispatch<React.SetStateAction<Mode>>) => {
  document.documentElement.classList.toggle(Mode.dark);
  setMode(prev => (prev === Mode.light ? Mode.dark : Mode.light));
};

export const toSnakeCase = (text: string) => text.trim().toLowerCase().replace(/\s+/g, '_');

dayjs.extend(relativeTime);
export const fromNow = (date: string | Date) => dayjs(date).fromNow();