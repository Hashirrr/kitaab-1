import { useFormik } from 'formik';
import { loginValidationSchema } from './validations';
import { LoginFormProps, LoginFormValues } from './interface';

export default function useLoginForm({ onSubmit }: LoginFormProps) {
  return useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: ''
    },
    validateOnMount: true,
    onSubmit: (values, helpers) => {
      onSubmit?.(values, helpers);
    },
    validationSchema: loginValidationSchema
  });
}