import { ReactNode } from 'react';
import { DeedCategory, Mode, SnackbarVariant } from '@/constants/enums';

export interface SnackbarState {
  open: boolean;
  message: string;
  duration?: number;
  variant: SnackbarVariant;
}

export interface SnackbarPayload {
  message: string;
  duration?: number;
  variant?: SnackbarVariant;
}

export interface UIState {
  viewport: {
    width: number,
    height: number
  },
  modal: {
    type: string,
    error: string,
    isOpen: boolean,
    disabled: boolean
  },
  mode: Mode,
  endDate: string,
  startDate: string,
  currentDeedId: string,
  openModalStep: number,
  currentScaleId: string,
  snackbar: SnackbarState,
  sidebarExpanded: boolean,
  deedCategory: DeedCategory,
  isChangingScaleType: boolean,
  pendingScaleCardIndex: number | null
};

export interface DateRangePayload {
  endDate: string;
  startDate: string;
};

export interface ViewportPayload {
  width: number;
  height: number;
};

export interface ChildrenProps {
  children: ReactNode;
};