'use client';

import { useEffect } from 'react';
import { onSubmit } from './utils';
import { FormikHelpers } from 'formik';
import styles from './deedadd.module.css';
import useDeedAddForm from './useDeedAddForm';
import { DeedAddFormValues } from './interface';
import { toSnakeCase } from '@/store/slices/utils';
import { useFormContext } from '@/store/FormProvider';
import Input from '@/components/primitive/input/Input';
import { setModalError } from '@/store/slices/uiSlice';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Textarea from '@/components/primitive/textarea/TextArea';
import { DeedCategoryApi, Form, ModalTypes } from '@/constants/enums';
import { useCreateDeed, useGetDeeds, useUpdateDeed } from '@/hooks/deeds/hook';
import { selectCurrentDeedId, selectDeedCategory, selectModal, selectOpenModalStep } from '@/store/slices/selectors';

export default function DeedAddForm() {
  const {
    DEED_NAME_LABEL,
    DEED_NAME_PLACEHOLDER,
    DEED_DESCRIPTION_LABEL,
    DEED_DESCRIPTION_PLACEHOLDER
  } = PLACEHOLDERS;
  const dispatch = useAppDispatch();
  const step = useAppSelector(selectOpenModalStep);
  const { data: getDeeds } = useGetDeeds();
  const modalType = useAppSelector(selectModal).type;
  const { mutateAsync: createDeed } = useCreateDeed();
  const currentDeedID = useAppSelector(selectCurrentDeedId);
  const deedCategory = useAppSelector(selectDeedCategory);
  const deedCategoryType = DeedCategoryApi[deedCategory];
  const { mutateAsync: updateDeed, isPending: isUpdateDeedPending } = useUpdateDeed();
  const currentDeed = getDeeds?.flatMap(deed => [deed, ...(deed.children ?? [])]).find(deed => deed.deed_item_id === currentDeedID);
  const formik = useDeedAddForm({
    onSubmit: (values: DeedAddFormValues, helpers: FormikHelpers<DeedAddFormValues>) =>
      onSubmit(step, modalType, helpers.resetForm, dispatch, currentDeedID, deedCategoryType, values, getDeeds!, createDeed, updateDeed),
    modalType,
    currentDeed
  });

  const { registerForm, unregisterForm } = useFormContext();

  useEffect(() => {
    registerForm(Form.deed_add, formik);

    return () => {
      unregisterForm(Form.deed_add);
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

  return (
    <form id={ModalTypes.add_deed} className={styles.container} onSubmit={formik.handleSubmit} >

      {<Input
        required
        label={DEED_NAME_LABEL}
        value={formik.values.name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        skeleton={isUpdateDeedPending}
        name={toSnakeCase(DEED_NAME_LABEL)}
        placeholder={DEED_NAME_PLACEHOLDER}
        helper={formik.touched.name ? formik.errors.name : undefined}
      />}

      <Textarea
        onBlur={formik.handleBlur}
        label={DEED_DESCRIPTION_LABEL}
        onChange={formik.handleChange}
        skeleton={isUpdateDeedPending}
        value={formik.values.description}
        name={toSnakeCase(DEED_DESCRIPTION_LABEL)}
        placeholder={DEED_DESCRIPTION_PLACEHOLDER}
        helper={formik.touched.description ? formik.errors.description : undefined}
      />
    </form>
  );
};