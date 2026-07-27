'use client';

import { useEffect } from 'react';
import { onSubmit } from './utils';
import { FormikHelpers } from 'formik';
import styles from './deedadd.module.css';
import useDeedAddForm from './useDeedAddForm';
import { useAppDispatch } from '@/store/hooks';
import { ModalTypes } from '@/constants/enums';
import { DeedAddFormValues } from './interface';
import { toSnakeCase } from '@/store/slices/utils';
import Input from '@/components/primitive/input/Input';
import { PLACEHOLDERS } from '@/constants/placeholders';
import Textarea from '@/components/primitive/textarea/TextArea';
import { incementOpenModalStep, setModalError } from '@/store/slices/uiSlice';

export default function DeedAddForm() {
  const {
    DEED_NAME_LABEL,
    DEED_NAME_PLACEHOLDER,
    DEED_DESCRIPTION_LABEL,
    DEED_DESCRIPTION_PLACEHOLDER
  } = PLACEHOLDERS;

  const dispatch = useAppDispatch();
  const formik = useDeedAddForm({
    onSubmit: (values: DeedAddFormValues, helpers: FormikHelpers<DeedAddFormValues>) =>
      onSubmit(values, helpers.resetForm, dispatch, incementOpenModalStep)
  });

  useEffect(() => {
    dispatch(setModalError(Object.values(formik.errors)[0]));
  }, [dispatch, formik.isValid, formik.errors]);

  useEffect(() => {
    return () => {
      dispatch(setModalError(''));
    };
  }, [dispatch]);

  return (
    <form id={ModalTypes.add_deed} className={styles.container} onSubmit={formik.handleSubmit} >

      <Input
        required
        label={DEED_NAME_LABEL}
        value={formik.values.name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        name={toSnakeCase(DEED_NAME_LABEL)}
        placeholder={DEED_NAME_PLACEHOLDER}
        helper={formik.touched.name ? formik.errors.name : undefined}
      />

      <Textarea
        onBlur={formik.handleBlur}
        label={DEED_DESCRIPTION_LABEL}
        onChange={formik.handleChange}
        value={formik.values.description}
        name={toSnakeCase(DEED_DESCRIPTION_LABEL)}
        placeholder={DEED_DESCRIPTION_PLACEHOLDER}
        helper={formik.touched.description ? formik.errors.description : undefined}
      />
    </form>
  );
};