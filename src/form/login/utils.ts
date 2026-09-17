import { FormikErrors, FormikHelpers } from 'formik';
import { LoginFormValues } from './interface';
import { AppDispatch } from '@/store';
import { openSnackbar } from '@/store/slices/uiSlice';
import { SnackbarVariant } from '@/constants/enums';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { LoginRequest, LoginResponse } from '@/hooks/auth/interface';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const getLoginTooltip = (errors: FormikErrors<LoginFormValues>): string => {
  const errorEntries = Object.entries(errors).filter(([_, err]) => Boolean(err));
  if (errorEntries.length === 0) return '';

  const [_, error] = errorEntries[0];
  return error;
};

export const isFormDisabled = <T extends object>(values: T, errors: FormikErrors<T>, isValid: boolean): boolean => {
  const hasErrors = Object.values(errors).some(Boolean);
  const hasEmptyField = Object.values(values).some((val) => typeof val === 'string' ? !val.trim() : !val);
  return hasEmptyField || hasErrors || !isValid;
};

export const onLoginSubmit = async (values: LoginFormValues, login: (data: LoginRequest) => Promise<LoginResponse>, router: AppRouterInstance, resetForm?: () => void, onError?: (message: string) => void) => {
  try {
    const anonymousId = typeof window !== 'undefined' ? localStorage.getItem('anonymous_id') || '62854e4b7a0475e2' : '62854e4b7a0475e2';

    await login({
      password: values.password,
      anonymous_id: anonymousId,
      email: values.email.trim()
    });

    resetForm?.();
    router.push(PLACEHOLDERS.SIDEBAR_LI_HREF_DASHBOARD);
  } catch (err: any) {
    onError?.('Invalid email or password');
  }
};

export const handleFormSubmit = async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>, loginMutation: (data: LoginRequest) => Promise<LoginResponse>, router: AppRouterInstance, dispatch: AppDispatch, onSubmit?: (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => void) => {
  if (onSubmit) {
    onSubmit(values, helpers);
    return;
  }
  await onLoginSubmit(
    values,
    loginMutation,
    router,
    helpers.resetForm,
    (errorMessage) => dispatch(openSnackbar({ message: errorMessage, variant: SnackbarVariant.error }))
  );
};