'use client';

import { createContext } from 'react';
import { FormContextType } from './interface';

export const FormContext = createContext<FormContextType | null>(null);