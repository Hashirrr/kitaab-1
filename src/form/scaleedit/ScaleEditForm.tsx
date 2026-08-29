'use client';

import { useEffect } from 'react';
import { onSubmit } from './utils';
import { FormikHelpers } from 'formik';
import styles from './scaleedit.module.css';
import useScaleEditForm from './useScaleEditForm';
import { ScaleEditFormValues } from './interface';
import { toSnakeCase } from '@/store/slices/utils';
import { Form, ModalTypes } from '@/constants/enums';
import { useFormContext } from '@/store/FormProvider';
import Input from '@/components/primitive/input/Input';
import { setModalError } from '@/store/slices/uiSlice';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Textarea from '@/components/primitive/textarea/TextArea';
import { useCreateScales, useGetScales, useUpdateScale } from '@/hooks/scales/hook';
import { selectCurrentScaleId, selectModal, selectOpenModalStep } from '@/store/slices/selectors';

export default function ScaleEditForm() {
  const {
    SCALE_NAME_LABEL,
    SCALE_NAME_PLACEHOLDER,
    SCALE_DESCRIPTION_LABEL,
    SCALE_DESCRIPTION_PLACEHOLDER
  } = PLACEHOLDERS;
  const dispatch = useAppDispatch();
  const { data: getScales } = useGetScales();
  const step = useAppSelector(selectOpenModalStep);
  const modalType = useAppSelector(selectModal).type;
  const currentScaleItemId = useAppSelector(selectCurrentScaleId);
  const { mutateAsync: updateScale, isPending: isUpdateScalePending } = useUpdateScale();
  const { mutateAsync: createScales, isPending: isCreateScalePending } = useCreateScales();
  const currentScale = getScales?.find(scale => scale.scale_items_id === currentScaleItemId);

  const formik = useScaleEditForm({
    onSubmit: (values: ScaleEditFormValues, helpers: FormikHelpers<ScaleEditFormValues>) =>
      onSubmit(step, modalType, helpers.resetForm, dispatch, values, getScales, updateScale, createScales),
    modalType,
    currentScale
  });

  const { registerForm, unregisterForm } = useFormContext();

  useEffect(() => {
    registerForm(Form.scale_edit, formik);

    return () => {
      unregisterForm(Form.scale_edit);
    };
  }, [registerForm, unregisterForm, formik.values]);

  useEffect(() => {
    dispatch(setModalError(Object.values(formik.errors)[0]));
  }, [dispatch, formik.isValid, formik.errors]);

  useEffect(() => {
    return () => {
      dispatch(setModalError(''));
    };
  }, [dispatch]);

  const isPending = isUpdateScalePending || isCreateScalePending;

  return (
    <form id={ModalTypes.edit_scale} className={styles.container} onSubmit={formik.handleSubmit}>
      <Input
        required
        skeleton={isPending}
        label={SCALE_NAME_LABEL}
        value={formik.values.name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        name={toSnakeCase(SCALE_NAME_LABEL)}
        placeholder={SCALE_NAME_PLACEHOLDER}
        helper={formik.touched.name ? formik.errors.name : undefined}
      />

      <Textarea
        skeleton={isPending}
        onBlur={formik.handleBlur}
        label={SCALE_DESCRIPTION_LABEL}
        onChange={formik.handleChange}
        value={formik.values.description}
        name={toSnakeCase(SCALE_DESCRIPTION_LABEL)}
        placeholder={SCALE_DESCRIPTION_PLACEHOLDER}
        helper={formik.touched.description ? formik.errors.description : undefined}
      />
    </form>
  );
};