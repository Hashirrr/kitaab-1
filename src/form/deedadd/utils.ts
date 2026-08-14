import { AppDispatch } from '@/store';
import { ModalTypes } from '@/constants/enums';
import { DeedAddFormValues } from './interface';
import { incementOpenModalStep } from '@/store/slices/uiSlice';
import { CreateHasanaatItemPayload, DeedItem, UpdateHasanaatItemPayload } from '@/hooks/deeds/interface';

export const onSubmit = async (
  step: number,
  type: string,
  resetForm: () => void,
  dispatch: AppDispatch,
  currentDeedId: string,
  values: DeedAddFormValues,
  getHasanaatItems: DeedItem[],
  createHasanaatItem: (values: CreateHasanaatItemPayload) => Promise<unknown>,
  updateHasanaatItem: (values: UpdateHasanaatItemPayload) => Promise<unknown>
) => {
  resetForm();
  const { name, description } = values;
  if (type === ModalTypes.add_deed) {
    const deed = getHasanaatItems?.at(0);
    const latestChild = deed?.children?.reduce<DeedItem | undefined>(
      (latest, child) => !latest || child.deed_item_id > latest.deed_item_id ? child : latest,
      undefined
    );
    const latestParent = getHasanaatItems?.reduce<DeedItem | undefined>(
      (latest, child) => !latest || child.deed_item_id > latest.deed_item_id ? child : latest,
      undefined
    );
    const parent_deed_item_id = step === 1 ? null: currentDeedId || deed?.deed_item_id!;
    const display_order = step === 1 ? Number(latestParent?.deed_item_id || 0) + 1: Number(latestChild?.deed_item_id || 0) + 1;
    await createHasanaatItem({ name, description, parent_deed_item_id, display_order });
    dispatch(incementOpenModalStep());
  } else if (type === ModalTypes.edit_deed) {
    const updateHasanaatItemPayload = {
      id: currentDeedId,
      payload: { name, description }
    }
    await updateHasanaatItem(updateHasanaatItemPayload);
  };
};