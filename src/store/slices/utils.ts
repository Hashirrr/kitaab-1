'use client';

import dayjs from 'dayjs';
import { useAppSelector } from '@/store/hooks';
import relativeTime from 'dayjs/plugin/relativeTime';
import { selectViewportWidth } from '@/store/slices/selectors';

export const useIsMobile = () => {
  const width = useAppSelector(selectViewportWidth);
  return width <= 768;
}

dayjs.extend(relativeTime);
export const fromNow = (date: string | Date) => dayjs(date).fromNow();