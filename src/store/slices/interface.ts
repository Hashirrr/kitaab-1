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
  currentDeedId: string,
  openModalStep: number,
  currentScaleId: string,
  sidebarExpanded: boolean,
  deedCategory: DeedCategory
};

export interface ViewportPayload {
  width: number;
  height: number;
};

export interface ChildrenProps {
  children: ReactNode;
};