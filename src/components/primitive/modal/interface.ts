export interface ModalProps {
  type: string;
  title: string;
  error?: string;
  width?: string;
  isOpen: boolean;
  disabled?: boolean;
  primaryBtn?: string;
  secondaryBtn?: string;
}