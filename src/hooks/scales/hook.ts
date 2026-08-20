import { QUERY } from "@/constants/query";
import { useAppSelector } from "@/store/hooks";
import { createScales, getScales } from "./api";
import { CreateScaleItemPayload } from "./interface";
import { selectCurrentDeedId } from "@/store/slices/selectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const { scales, create } = QUERY;

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