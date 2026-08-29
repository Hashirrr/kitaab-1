import { AppDispatch } from '@/store';
import { ModalTypes } from '@/constants/enums';
import { ScaleEditFormValues } from './interface';
import { closeModal, incementOpenModalStep } from '@/store/slices/uiSlice';
import { CreateScaleItemPayload, ScaleItem, UpdateScaleItemPayload } from '@/hooks/scales/interface';

export const onSubmit = async (
  step: number,
  type: string,
  resetForm: () => void,
  dispatch: AppDispatch,
  values: ScaleEditFormValues,
  getScales: ScaleItem[] | undefined,
  updateScale: (values: UpdateScaleItemPayload) => Promise<unknown>,
  createScales: (payload: CreateScaleItemPayload[]) => Promise<unknown>
) => {
  const { name, description } = values;
  resetForm();
  if (type === ModalTypes.add_scale) {
    const maxOrder = getScales?.reduce((max, item) => Math.max(max, Number(item.display_order || 0)), 0) ?? 0;
    await createScales([{
      name,
      description: description || null,
      display_order: maxOrder + 1
    }]);
    dispatch(incementOpenModalStep());
  } else if (type === ModalTypes.edit_scale) {
    const updateScalePayload = { name, description: description || null };
    await updateScale(updateScalePayload);
    dispatch(closeModal());
  }
};
