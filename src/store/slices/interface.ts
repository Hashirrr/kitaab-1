import { ReactNode } from 'react';
import { DeedCategory } from '@/constants/enums';

export interface UIState {
  sidebarExpanded: boolean,
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
  currentDeedId: string,
  openModalStep: number,
  deedCategory: DeedCategory
};

export interface ViewportPayload {
  width: number;
  height: number;
};

export interface ChildrenProps {
  children: ReactNode;
}