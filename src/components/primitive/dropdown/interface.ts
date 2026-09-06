import { ReactNode } from 'react';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
  skeleton?: boolean;
  className?: string;
  defaultValue?: string;
  width?: string | number;
  onChange?: (value: string) => void;
  options: (DropdownOption | string)[];
}