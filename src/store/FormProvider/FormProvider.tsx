'use client';

import { useCallback, useRef } from 'react';
import { FormContext } from './FormContext';
import { FormInstance, FormProviderProps } from './interface';

export default function FormProvider({
  children,
}: FormProviderProps) {
  const forms = useRef<Record<string, FormInstance>>({});

  const registerForm = useCallback(
    (formId: string, formik: FormInstance) => {
      forms.current[formId] = formik;
    }, []
  );

  const unregisterForm = useCallback((formId: string) => {
    delete forms.current[formId];
  }, []);

  return (
    <FormContext.Provider value={{ forms: forms.current, registerForm, unregisterForm }}>
      {children}
    </FormContext.Provider>
  );
};