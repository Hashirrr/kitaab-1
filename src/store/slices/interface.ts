import { ReactNode } from 'react';
import { DeedCategory, Mode } from '@/constants/enums';

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
  sidebarExpanded: boolean,
  deedCategory: DeedCategory
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