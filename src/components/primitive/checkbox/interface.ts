import { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  helper?: string;
  label?: ReactNode;
  skeleton?: boolean;
};