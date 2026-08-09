'use client';

import { useContext } from 'react';
import { FormContext } from './FormContext';
import { PLACEHOLDERS } from '@/constants/placeholders';

export const useFormContext = () => {
  const context = useContext(FormContext);
  const { USE_FORM_CONTEXT_ERROR } = PLACEHOLDERS;
  if (!context)
    throw new Error(USE_FORM_CONTEXT_ERROR);

  return context;
};