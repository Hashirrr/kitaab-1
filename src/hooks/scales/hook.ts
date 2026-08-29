import { QUERY } from "@/constants/query";
import { useAppSelector } from "@/store/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { selectCurrentDeedId, selectCurrentScaleId } from "@/store/slices/selectors";
import { createScales, deleteScale, getScales, updateScale, updateScalesDisplayOrder } from "./api";
import { CreateScaleItemPayload, UpdateScaleItemPayload, UpdateScalesDisplayOrderPayload } from "./interface";

const { scales, create, update, display_order } = QUERY;

export const useGetScales = () => {
  const scaleId = useAppSelector(selectCurrentDeedId);
  return useQuery({ enabled: !!scaleId, queryKey: [scales, scaleId], queryFn: () => getScales(scaleId) });
};

export const useCreateScales = () => {
  const queryClient = useQueryClient();
  const scaleId = useAppSelector(selectCurrentDeedId);

  return useMutation({
    mutationKey: [scales, create],
    mutationFn: (payload: CreateScaleItemPayload[]) => createScales(scaleId, payload),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [scales, scaleId] })
  });
};

export const useUpdateScale = () => {
  const queryClient = useQueryClient();
  const scaleId = useAppSelector(selectCurrentDeedId);
  const itemId = useAppSelector(selectCurrentScaleId);

  return useMutation({
    mutationKey: [scales, update],
    mutationFn: (payload: UpdateScaleItemPayload) => updateScale(scaleId, itemId, payload),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [scales, scaleId] })
  });
};

export const useDeleteScaleItem = () => {
  const queryClient = useQueryClient();
  const scaleId = useAppSelector(selectCurrentDeedId);
  const itemId = useAppSelector(selectCurrentScaleId);

  return useMutation({
    mutationFn: () => deleteScale(scaleId, itemId),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [scales, scaleId] })
  });
};

export const useUpdateScalesDisplayOrder = () => {
  const queryClient = useQueryClient();
  const scaleId = useAppSelector(selectCurrentDeedId);

  return useMutation({
    mutationKey: [scales, display_order],
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [scales, scaleId] }),
    mutationFn: (payload: UpdateScalesDisplayOrderPayload) => updateScalesDisplayOrder(scaleId, payload)
  });
};