import { QUERY } from '@/constants/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createHasanaatItem, deleteHasanaatItem, getHasanaatItems, updateHasanaatItem, updateHasanaatItemDisplayOrder } from './api';

const { deeds_hasanaat, create, update, display_order } = QUERY;

export const useGetHasanaatItems = () => {
  return useQuery({ queryKey: [deeds_hasanaat], queryFn: getHasanaatItems });
};

export const useCreateHasanaatItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHasanaatItem,
    mutationKey: [deeds_hasanaat, create],
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds_hasanaat] })
  });
};

export const useUpdateHasanaatItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHasanaatItem,
    mutationKey: [deeds_hasanaat, update],
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds_hasanaat] })
  });
};

export const useDeleteHasanaatItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHasanaatItem,
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds_hasanaat] })
  });
};

export const useUpdateHasanaatItemDisplayOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHasanaatItemDisplayOrder,
    mutationKey: [deeds_hasanaat, display_order],
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [deeds_hasanaat] })
  });
};