import { ComponentPropsWithoutRef, ReactNode } from 'react';
import Link from 'next/link';

export interface FlipButtonProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> {
  href?: string;
  children?: ReactNode;
}