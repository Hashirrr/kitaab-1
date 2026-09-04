import { QUERY } from '@/constants/query';
import { createRecords, getRecordsByDate } from './api';
import { CreateRecordsPayload } from './interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { records, create } = QUERY;

export const useGetRecords = (date: string) => {
  return useQuery({
    enabled: !!date,
    queryKey: [records, date],
    queryFn: () => getRecordsByDate(date)
  });
};

export const useCreateRecords = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [records, create],
    mutationFn: (payload: CreateRecordsPayload) => createRecords(payload),
    onSuccess: async (_, variables) => {
      const dates = Array.from(new Set(variables.records.map((r) => r.date)));
      await Promise.all(dates.map((d) => queryClient.invalidateQueries({ queryKey: [records, d] })));
    }
  });
};