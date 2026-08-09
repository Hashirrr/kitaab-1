import axios from '../axios';
import { ENDPOINTS } from '@/constants/endpoints';
import deeds from '@/mock/deeds.json' with { type: 'json' };
import { GetHasanaatItemsResponse, CreateHasanaatItemPayload } from './interface';

export const getHasanaatItems = async (): Promise<GetHasanaatItemsResponse> => {
  try {
    const { data } = await axios.get<GetHasanaatItemsResponse>(ENDPOINTS.get_deeds_hasanaat_items);
    return data;
  } catch {
    return deeds as GetHasanaatItemsResponse;
  }
};

export const createHasanaatItem = async (payload: CreateHasanaatItemPayload): Promise<GetHasanaatItemsResponse> => {
  const { data } = await axios.post<GetHasanaatItemsResponse>(ENDPOINTS.post_deeds_hasanaat_items, payload);
  return data;
};

export const deleteHasanaatItem = async (id: string): Promise<void> => {
  await axios.delete(`${ENDPOINTS.delete_deeds_hasanaat_items}/${id}`);
};