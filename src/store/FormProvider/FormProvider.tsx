'use client';

import { FormContext } from './FormContext';
import { useCallback, useState } from 'react';
import { FormInstance, FormProviderProps } from './interface';

export default function FormProvider({ children }: FormProviderProps) {
  const [forms, setForms] = useState<Record<string, FormInstance>>({});

  const registerForm = useCallback(
    (formId: string, formik: FormInstance) => {
    setForms(prev => ({ ...prev, [formId]: formik }));
  }, []);

  const unregisterForm = useCallback((formId: string) => {
    setForms(prev => {
      const updated = { ...prev };
      delete updated[formId];
      return updated;
    });
  }, []);

  return (
    <FormContext.Provider value={{ forms, registerForm, unregisterForm }}>
      {children}
    </FormContext.Provider>
  );
};