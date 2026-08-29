'use client';

import Link from 'next/link';
import { isActiveLocation } from './utils';
import styles from './sidebaritem.module.css';
import { usePathname } from 'next/navigation';
import { sidebarItemProps } from './interface';

export default function SidebarItem({ text, logo, href }: sidebarItemProps) {

  const location = usePathname();
  return (
    <Link href={href} className={`${styles.container} ${isActiveLocation(location, href)}`}>
      {logo}
      <p className={styles.text}>{text}</p>
    </Link>
  );
};