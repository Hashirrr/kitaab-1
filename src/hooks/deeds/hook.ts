import { QUERY } from '@/constants/query';
import { useAppSelector } from '@/store/hooks';
import { DeedCategoryApi } from '@/constants/enums';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { selectCurrentDeedId, selectDeedCategory } from '@/store/slices/selectors';
import { createDeed, deleteDeed, updateDeed, updateDeedsDisplayOrder, getDeeds } from './api';
import { CreateHasanaatItemPayload, UpdateDeedPayload, UpdateDeedsDisplayOrderPayload } from './interface';

const { deeds, create, update, display_order } = QUERY;

export const useGetDeeds = () => {
  const deedCategory = useAppSelector(selectDeedCategory);
  const type = DeedCategoryApi[deedCategory];
  return useQuery({ queryKey: [deeds, type], queryFn: () => getDeeds(type) });
};

export const useCreateDeed = () => {
  const queryClient = useQueryClient();
  const deedCategory = useAppSelector(selectDeedCategory);
  const type = DeedCategoryApi[deedCategory];

  return useMutation({
    mutationKey: [deeds, create],
    mutationFn: (payload: CreateHasanaatItemPayload) => createDeed(type, payload),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds, type] })
  });
};

export const useUpdateDeed = () => {
  const queryClient = useQueryClient();
  const id = useAppSelector(selectCurrentDeedId);
  const deedCategory = useAppSelector(selectDeedCategory);
  const type = DeedCategoryApi[deedCategory];

  return useMutation({
    mutationKey: [deeds, update],
    mutationFn: (payload: UpdateDeedPayload) => updateDeed(id, type, payload),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds, type] })
  });
};

export const useDeleteDeed = () => {
  const queryClient = useQueryClient();
  const id = useAppSelector(selectCurrentDeedId);
  const deedCategory = useAppSelector(selectDeedCategory);
  const type = DeedCategoryApi[deedCategory];

  return useMutation({
    mutationFn: () => deleteDeed(id, type),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds, type] })
  });
};

export const useUpdateDeedsDisplayOrder = () => {
  const queryClient = useQueryClient();
  const deedCategory = useAppSelector(selectDeedCategory);
  const type = DeedCategoryApi[deedCategory];

  return useMutation({
    mutationKey: [deeds, display_order],
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds, type] }),
    mutationFn: (payload: UpdateDeedsDisplayOrderPayload) => updateDeedsDisplayOrder(type, payload)
  });
};