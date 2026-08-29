'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setDeedCategory, setMode, setViewport } from './uiSlice';
import { DeedCategory, EventListeners, LocalStorage, Mode } from '@/constants/enums';

export function ViewportWatcher() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const update = () => dispatch(setViewport({ width: window.innerWidth, height: window.innerHeight }));
    update();
    window.addEventListener(EventListeners.resize, update);

    const savedCategory = localStorage.getItem(LocalStorage.deed_category) as DeedCategory;
    if (savedCategory && Object.values(DeedCategory).includes(savedCategory)) {
      dispatch(setDeedCategory(savedCategory));
    }

    const isDark = document.documentElement.classList.contains(Mode.dark);
    const savedMode = (localStorage.getItem(LocalStorage.mode) as Mode) || (isDark ? Mode.dark : Mode.light);
    if (savedMode && Object.values(Mode).includes(savedMode)) {
      dispatch(setMode(savedMode));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LocalStorage.deed_category && e.newValue) {
        if (Object.values(DeedCategory).includes(e.newValue as DeedCategory)) {
          dispatch(setDeedCategory(e.newValue as DeedCategory));
        }
      }
      if (e.key === LocalStorage.mode && e.newValue) {
        if (Object.values(Mode).includes(e.newValue as Mode)) {
          dispatch(setMode(e.newValue as Mode));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(EventListeners.resize, update);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  return null;
};