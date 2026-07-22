import { ReactNode } from "react";

export interface ModalProps {
  type: string;
  title: string;
  width?: string;
  isOpen: boolean;
  onClose: () => void;
  primaryBtn?: string;
  secondaryBtn?: string;
  onConfirm: () => void;
  closeOnBackdrop?: boolean;
}