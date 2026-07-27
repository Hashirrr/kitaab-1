import { useFormik } from 'formik';
import { deedAddValidationSchema } from './validations';
import { DeedAddFormProps, DeedAddFormValues } from './interface';

export default function useDeedAddForm({ onSubmit }: DeedAddFormProps) {
  return useFormik<DeedAddFormValues>({
    onSubmit,
    validationSchema: deedAddValidationSchema,
    initialValues: { name: '', description: '' }
  });
};