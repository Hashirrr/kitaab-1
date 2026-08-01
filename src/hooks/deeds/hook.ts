import { getHasanaatItems } from './api';
import { QUERY } from '@/constants/query';
import { useQuery } from '@tanstack/react-query';

export const useGetHasanaatItems = () => {
  return useQuery({ queryKey: [QUERY.deeds_hasanaat], queryFn: getHasanaatItems });
};