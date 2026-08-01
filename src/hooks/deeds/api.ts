import axios from '../axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { GetHasanaatItemsResponse } from './interface';
import deeds from '@/mock/deeds.json' with { type: 'json' };

export const getHasanaatItems = async (): Promise<GetHasanaatItemsResponse> => {
  try {
    const { data } = await axios.get<GetHasanaatItemsResponse>(ENDPOINTS.get_deeds_hasanaat_items);
    return data;
  } catch {
    return deeds as GetHasanaatItemsResponse;
  }
};