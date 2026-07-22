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
    title: string,
    deedId: number,
    isOpen: boolean,
    cancelText: string,
    confirmText: string
  },
  deedCategory: DeedCategory
};

export interface ViewportPayload {
  width: number;
  height: number;
};

export interface ModalPayload {
  type: string;
  title: string;
  deedId: number;
  cancelText?: string;
  confirmText?: string;
}

export interface ChildrenProps {
  children: ReactNode;
}