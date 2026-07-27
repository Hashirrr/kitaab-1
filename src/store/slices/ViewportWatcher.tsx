'use client';

import { useEffect } from 'react';
import { setViewport } from './uiSlice';
import { useAppDispatch } from '@/store/hooks';
import { EventListeners } from '@/constants/enums';

export function ViewportWatcher() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const update = () => dispatch(setViewport({ width: window.innerWidth, height: window.innerHeight }));
    update();
    window.addEventListener(EventListeners.resize, update);
    return () => {
      window.removeEventListener(EventListeners.resize, update);
    };
  }, [dispatch]);

  return null;
}