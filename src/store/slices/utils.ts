'use client';

import dayjs from 'dayjs';
import { AppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { setMode } from '@/store/slices/uiSlice';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Mode, LocalStorage } from '@/constants/enums';
import { selectViewportWidth } from '@/store/slices/selectors';

export const useIsMobile = () => {
  const width = useAppSelector(selectViewportWidth);
  return width <= 768;
}

export const useIsTablet = () => {
  const width = useAppSelector(selectViewportWidth);
  return width <= 1024;
}

export const toggleTheme = (dispatch: AppDispatch, mode: Mode) => {
  dispatch(setMode(mode === Mode.light ? Mode.dark : Mode.light));
};

export const themeScript = `
  (function() {
    try {
      var savedMode = localStorage.getItem('${LocalStorage.mode}');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var mode = savedMode ? savedMode : (prefersDark ? '${Mode.dark}' : '${Mode.light}');
      if (mode === '${Mode.dark}') {
        document.documentElement.classList.add('${Mode.dark}');
      } else {
        document.documentElement.classList.remove('${Mode.dark}');
      }
    } catch (e) {}
  })();
`;

export const toSnakeCase = (text: string) => text.trim().toLowerCase().replace(/\s+/g, '_');

dayjs.extend(relativeTime);
export const fromNow = (date: string | Date) => dayjs(date).fromNow();