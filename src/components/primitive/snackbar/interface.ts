import { ReactNode } from 'react';
import { SnackbarVariant } from '@/constants/enums';

export interface SnackbarProps {
  open?: boolean;
  duration?: number;
  action?: ReactNode;
  message?: ReactNode;
  onClose?: () => void;
  variant?: SnackbarVariant;
}