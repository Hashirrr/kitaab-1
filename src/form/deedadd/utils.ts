import { AppDispatch } from '@/store';
import { DeedAddFormValues } from './interface';

export const onSubmit = (values: DeedAddFormValues, resetForm: () => void, dispatch: AppDispatch, action: () => { type: string }) => {
  const { name, description } = values;
  console.log({ name, description });
  resetForm();
  dispatch(action());
};