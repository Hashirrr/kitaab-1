import { Cursor } from '@/constants/enums';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  cursor: Cursor;
  icon: ReactNode;
  variant: string;
  shadow?: boolean;
}