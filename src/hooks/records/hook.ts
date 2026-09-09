import { QUERY } from '@/constants/query';
import { CreateRecordsPayload } from './interface';
import { createRecords, getRecordsByDate, getRecordsRange } from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { records, create, range } = QUERY;

export const useGetRecords = (date: string) => {
  return useQuery({
    enabled: !!date,
    queryKey: [records, date],
    queryFn: () => getRecordsByDate(date)
  });
};

export const useGetRecordsRange = (startDate?: string, endDate?: string) => {
  return useQuery({
    enabled: Boolean(startDate && endDate),
    queryKey: [records, range, startDate, endDate],
    queryFn: () => getRecordsRange(startDate!, endDate!)
  });
};

export const useCreateRecords = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [records, create],
    mutationFn: (payload: CreateRecordsPayload) => createRecords(payload),
    onSuccess: async (_, variables) => {
      const dates = Array.from(new Set(variables.records.map((r) => r.date)));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [records, range] }),
        ...dates.map((d) => queryClient.invalidateQueries({ queryKey: [records, d] }))
      ]);
    }
  });
};