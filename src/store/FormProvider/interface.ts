import { ReactNode } from "react";
import { FormikProps } from "formik";

export interface FormProviderProps {
  children: ReactNode;
};

export type FormInstance = FormikProps<any>;

export interface FormContextType {
  forms: Record<string, FormInstance>;
  unregisterForm: (formId: string) => void;
  registerForm: (formId: string, formik: FormInstance) => void;
};