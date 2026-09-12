'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './header.module.css';
import { FaArrowLeftLong } from "react-icons/fa6";
import { toggleTheme } from '@/store/slices/utils';
import { getPageTitle, isNestedRoute } from './utils';
import { usePathname, useRouter } from 'next/navigation';
import { setDeedCategory } from '@/store/slices/uiSlice';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { selectDeedCategory, selectMode } from '@/store/slices/selectors';
import { Cursor, DeedCategory, IconButtonBackground, Mode } from '@/constants/enums';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);
  const pageTitle = getPageTitle(pathname);
  const [mounted, setMounted] = useState(false);
  const deedCategory = useAppSelector(selectDeedCategory);
  const isHasanaat = deedCategory === DeedCategory.hasanaat;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.page__header}>
      {isNestedRoute(pathname) && <IconButton
        shadow
        cursor={Cursor.pointer}
        onClick={() => router.back()}
        variant={IconButtonBackground.secondary}
        icon={<FaArrowLeftLong size={12} />}
      />}
      <h2 className={styles.page__name}>{pageTitle}</h2>
      <button className={clsx(styles.hasanaat__saiyyiaat, {
        [styles.flipped]: !isHasanaat
      })}
        onClick={() => dispatch(setDeedCategory(isHasanaat ? DeedCategory.sayyiaat : DeedCategory.hasanaat))}
      >
        <div className={clsx(styles.inner, { [styles.animate]: mounted })}>
          <p className={styles.front}>{DeedCategory.hasanaat}</p>
          <p className={styles.back}>{DeedCategory.sayyiaat}</p>
        </div>
      </button>
      <IconButton
        shadow
        cursor={Cursor.pointer}
        onClick={() => toggleTheme(dispatch, mode)}
        variant={IconButtonBackground.secondary}
        icon={mode === Mode.light ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
      />
    </div>
  );
};