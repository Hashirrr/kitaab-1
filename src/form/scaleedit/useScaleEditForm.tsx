import { useFormik } from 'formik';
import { ModalTypes } from '@/constants/enums';
import { scaleEditValidationSchema } from './validations';
import { ScaleEditFormProps, ScaleEditFormValues } from './interface';

export default function useScaleEditForm({ onSubmit, currentScale, modalType }: ScaleEditFormProps) {
  return useFormik<ScaleEditFormValues>({
    onSubmit,
    enableReinitialize: true,
    validationSchema: scaleEditValidationSchema,
    initialValues: modalType === ModalTypes.edit_scale ? { name: currentScale?.name || '', description: currentScale?.description || '' } : { name: '', description: '' }
  });
}
