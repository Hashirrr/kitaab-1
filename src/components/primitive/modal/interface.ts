export interface ModalProps {
  title: string;
  width?: string;
  isOpen: boolean;
  onClose: () => void;
  description: string;
  primaryBtn?: string;
  secondaryBtn?: string;
  onConfirm: () => void;
  closeOnBackdrop?: boolean;
}