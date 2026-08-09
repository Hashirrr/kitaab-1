import { AppDispatch } from '@/store';
import { DeedAddFormValues } from './interface';

export const onSubmit = async (values: DeedAddFormValues, resetForm: () => void, dispatch: AppDispatch, action: () => { type: string }, createHasanaatItem: (values: DeedAddFormValues) => Promise<unknown>) => {
  resetForm();
  const { name, description } = values;
  await createHasanaatItem({ name, description });
  dispatch(action());
};