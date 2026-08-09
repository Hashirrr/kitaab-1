import { QUERY } from '@/constants/query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createHasanaatItem, deleteHasanaatItem, getHasanaatItems } from './api';

const { deeds_hasanaat, create } = QUERY;

export const useGetHasanaatItems = () => {
  return useQuery({ queryKey: [deeds_hasanaat], queryFn: getHasanaatItems });
};

export const useCreateHasanaatItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHasanaatItem,
    mutationKey: [deeds_hasanaat, create],
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY.deeds_hasanaat]
      });
    }
  });
};

export const useDeleteHasanaatItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHasanaatItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY.deeds_hasanaat]
      });
    }
  });
};