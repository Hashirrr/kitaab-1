import { ReactNode } from 'react';
import { DeedCategory } from '@/constants/enums';

export interface UIState {
  sidebarExpanded: boolean,
  viewport: {
    width: number,
    height: number
  },
  modal: {
    title: string,
    deedId: number,
    isOpen: boolean,
    cancelText: string,
    confirmText: string,
    description: string
  },
  deedCategory: DeedCategory
};

export interface ViewportPayload {
  width: number;
  height: number;
};

export interface ModalPayload {
  title: string;
  deedId: number;
  description: string;
  cancelText?: string;
  confirmText?: string;
}

export interface ChildrenProps {
  children: ReactNode;
}