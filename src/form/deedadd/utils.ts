import { AppDispatch } from '@/store';
import { getDeeds } from '@/hooks/deeds/api';
import { ModalTypes } from '@/constants/enums';
import { DeedAddFormValues } from './interface';
import { closeModal, incementOpenModalStep, setCurrentDeedId } from '@/store/slices/uiSlice';
import { CreateHasanaatItemPayload, DeedItem, UpdateDeedPayload } from '@/hooks/deeds/interface';

export const onSubmit = async (
  step: number,
  type: string,
  resetForm: () => void,
  dispatch: AppDispatch,
  currentDeedId: string,
  deedCategoryType: string,
  values: DeedAddFormValues,
  getHasanaatItems: DeedItem[],
  createDeed: (values: CreateHasanaatItemPayload) => Promise<unknown>,
  updateDeed: (values: UpdateDeedPayload) => Promise<unknown>,
) => {
  resetForm();
  const { name, description } = values;
  if (type === ModalTypes.add_deed) {
    if (step === 1) {
      const maxParentOrder = getHasanaatItems?.reduce((max, item) => Math.max(max, Number(item.display_order || 0)), 0) ?? 0;

      const createdDeed = (await createDeed({
        name,
        description,
        parent_deed_item_id: null,
        display_order: maxParentOrder + 1
      })) as any;

      let createdDeedId =
        createdDeed?.deed_item_id ||
        createdDeed?.id ||
        createdDeed?.data?.deed_item_id ||
        createdDeed?.data?.id ||
        (Array.isArray(createdDeed) ? createdDeed.at(-1)?.deed_item_id : undefined);

      if (!createdDeedId && deedCategoryType) {
        const latestDeeds = await getDeeds(deedCategoryType);
        const matchingDeed =
          latestDeeds?.find((item: DeedItem) => item.name === name && Number(item.display_order) === maxParentOrder + 1) ||
          latestDeeds?.find((item: DeedItem) => item.name === name) ||
          latestDeeds?.at(-1);
        createdDeedId = matchingDeed?.deed_item_id;
      }

      console.log('[Add Parent Deed] Created Deed Response:', createdDeed);
      console.log('[Add Parent Deed] Current Deed ID:', createdDeedId);

      if (createdDeedId)
        dispatch(setCurrentDeedId(String(createdDeedId)));
      dispatch(incementOpenModalStep());
    } else {
      const targetParent = currentDeedId ? (getHasanaatItems?.find(item => item.deed_item_id === currentDeedId || item.children?.some(child => child.deed_item_id === currentDeedId)) ?? getHasanaatItems?.at(-1)) : getHasanaatItems?.at(-1);

      const parent_deed_item_id = targetParent?.deed_item_id || currentDeedId || null;

      if (!currentDeedId && targetParent?.deed_item_id)
        dispatch(setCurrentDeedId(targetParent.deed_item_id));

      await createDeed({
        name,
        description,
        parent_deed_item_id,
        display_order: (targetParent?.children?.reduce((max, child) => Math.max(max, Number(child.display_order || 0)), 0) || 0) + 1
      });
      dispatch(incementOpenModalStep());
    }
  } else if (type === ModalTypes.edit_deed) {
    const updateHasanaatItemPayload = { name, description };
    await updateDeed(updateHasanaatItemPayload);
    dispatch(closeModal());
  }
};