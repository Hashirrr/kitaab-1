'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { MouseEvent } from 'react';
import styles from './flipbutton.module.css';
import { FlipButtonProps } from './interface';

export default function FlipButton({ children, onClick, className, href = '#', scroll = false, ...props }: FlipButtonProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href === '#' || href === '') e.preventDefault();
    onClick?.(e);
  };

  return (
    <Link
      {...props}
      href={href}
      role='button'
      scroll={scroll}
      onClick={handleClick}
      className={clsx(styles.flip__button, className)}
    >
      {children}
    </Link>
  );
}
