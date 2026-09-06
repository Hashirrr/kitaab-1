import { InputHTMLAttributes, ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  helper?: string;
  label?: ReactNode;
  skeleton?: boolean;
};