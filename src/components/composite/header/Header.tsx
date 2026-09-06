'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { getPageTitle, isNestedRoute } from './utils';
import styles from './header.module.css';
import { LuArrowLeft, LuMoon, LuSun } from 'react-icons/lu';
import { toggleTheme } from '@/store/slices/utils';
import { usePathname, useRouter } from 'next/navigation';
import { setDeedCategory } from '@/store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { selectDeedCategory, selectMode } from '@/store/slices/selectors';
import { Cursor, DeedCategory, IconButtonBackground, Mode } from '@/constants/enums';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);
  const [mounted, setMounted] = useState(false);
  const deedCategory = useAppSelector(selectDeedCategory);
  const isHasanaat = deedCategory === DeedCategory.hasanaat;
  const pageMeta = getPageTitle(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.page__header}>
      {isNestedRoute(pathname) && (
        <IconButton
          shadow
          cursor={Cursor.pointer}
          onClick={() => router.back()}
          variant={IconButtonBackground.secondary}
          icon={<LuArrowLeft size={16} />}
        />
      )}
      <div className={styles.title__container}>
        <h1 className={styles.page__name}>{pageMeta.title}</h1>
        <span className={styles.arabic__badge}>{pageMeta.arabic}</span>
      </div>
      <button
        aria-label="Toggle Hasanaat and Sayyi'aat"
        className={clsx(styles.hasanaat__saiyyiaat, {
          [styles.flipped]: !isHasanaat
        })}
        onClick={() => dispatch(setDeedCategory(isHasanaat ? DeedCategory.sayyiaat : DeedCategory.hasanaat))}
      >
        <div className={clsx(styles.inner, { [styles.animate]: mounted })}>
          <p className={styles.front}>
            <span className={styles.coin__dot} /> {DeedCategory.hasanaat}
          </p>
          <p className={styles.back}>
            <span className={clsx(styles.coin__dot, styles.sayyiaat__dot)} /> {DeedCategory.sayyiaat}
          </p>
        </div>
      </button>
      <IconButton
        shadow
        cursor={Cursor.pointer}
        onClick={() => toggleTheme(dispatch, mode)}
        variant={IconButtonBackground.secondary}
        icon={mode === Mode.light ? <LuMoon size={18} /> : <LuSun size={18} />}
      />
    </div>
  );
};