import { useFormik } from 'formik';
import { ModalTypes } from '@/constants/enums';
import { deedAddValidationSchema } from './validations';
import { DeedAddFormProps, DeedAddFormValues } from './interface';

export default function useDeedAddForm({ onSubmit, currentDeed, modalType }: DeedAddFormProps) {
  return useFormik<DeedAddFormValues>({
    onSubmit,
    enableReinitialize: true,
    validationSchema: deedAddValidationSchema,
    initialValues: modalType === ModalTypes.edit_deed ? { name: currentDeed?.name || '', description: currentDeed?.description || '' }: { name: '', description: '' } 
  });
}