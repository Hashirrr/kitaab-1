import { FormikHelpers } from 'formik';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onGuestLogin?: () => void;
  onForgotPassword?: () => void;
  onSubmit?: (
    values: LoginFormValues,
    helpers: FormikHelpers<LoginFormValues>
  ) => void;
}