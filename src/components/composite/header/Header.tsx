'use client';

import clsx from 'clsx';
import { useState } from 'react';
import styles from './header.module.css';
import { toggleTheme } from '@/store/slices/utils';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { setDeedCategory } from '@/store/slices/uiSlice';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { selectDeedCategory } from '@/store/slices/selectors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { Cursor, DeedCategory, IconButtonBackground, Mode } from '@/constants/enums';

export default function Header() {
  const dispatch = useAppDispatch();
  const { PAGE_NAME_DEEDS } = PLACEHOLDERS;
  const [mode, setMode] = useState<Mode>(Mode.light);
  const deedCategory = useAppSelector(selectDeedCategory);
  const isHasanaat = deedCategory === DeedCategory.hasanaat;
  return (
    <div className={styles.page__header}>
    <h2 className={styles.page__name}>{PAGE_NAME_DEEDS}</h2>
    <button className={clsx(
        styles.hasanaat__saiyyiaat, {
        [styles.flipped]: !isHasanaat
        })}
        onClick={() => dispatch(setDeedCategory(isHasanaat ? DeedCategory.sayyiaat: DeedCategory.hasanaat))}
    >
        <div className={styles.inner}>
        <p className={styles.front}>{DeedCategory.hasanaat}</p>
        <p className={styles.back}>{DeedCategory.sayyiaat}</p>
        </div>
    </button>
    <IconButton
        shadow
        cursor={Cursor.pointer}
        onClick={() => toggleTheme(setMode)}
        variant={IconButtonBackground.secondary}
        icon={mode === Mode.light ? <MdDarkMode size={20}/>: <MdLightMode size={20}/>}
    />
    </div>
  );
};