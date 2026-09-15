'use client';

import styles from './layout.module.css';
import { usePathname } from 'next/navigation';
import { toggleTheme } from '@/store/slices/utils';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { ChildrenProps } from '@/store/slices/interface';
import Header from '@/components/composite/header/Header';
import Sidebar from '@/components/composite/sidebar/Sidebar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { selectMode } from '@/store/slices/selectors';
import { Cursor, IconButtonBackground, Mode } from '@/constants/enums';

export default function AppLayout({ children }: Readonly<ChildrenProps>) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);
  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return (
      <main className={styles.auth__wrapper}>
        <div className={styles.auth__header}>
          <IconButton
            shadow
            cursor={Cursor.pointer}
            onClick={() => toggleTheme(dispatch, mode)}
            variant={IconButtonBackground.secondary}
            icon={mode === Mode.light ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
          />
        </div>
        <div className={styles.auth__content}>
          {children}
        </div>
      </main>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.container}>
        <Header />
        {children}
      </div>
    </div>
  );
}
