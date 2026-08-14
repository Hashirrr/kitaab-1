import axios from '../axios';
import { ENDPOINTS } from '@/constants/endpoints';
import deeds from '@/mock/deeds.json' with { type: 'json' };
import { GetHasanaatItemsResponse, CreateHasanaatItemPayload, DeedItem, UpdateHasanaatItemPayload, UpdateHasanaatItemDisplayOrderPayload } from './interface';

const {
  get_deeds_hasanaat_items,
  post_deeds_hasanaat_items,
  patch_deeds_hasanaat_items,
  delete_deeds_hasanaat_items,
  patch_deeds_hasanaat_items_display_order
} = ENDPOINTS;

export const getHasanaatItems = async (): Promise<GetHasanaatItemsResponse> => {
  try {
    const { data } = await axios.get<GetHasanaatItemsResponse>(get_deeds_hasanaat_items);
    data.sort((a, b) => Number(a.display_order) - Number(b.display_order));
    return data;
  } catch {
    return deeds as GetHasanaatItemsResponse;
  }
};

export const createHasanaatItem = async (payload: CreateHasanaatItemPayload): Promise<GetHasanaatItemsResponse> => {
  const { data } = await axios.post<GetHasanaatItemsResponse>(post_deeds_hasanaat_items, payload);
  return data;
};

export const updateHasanaatItem = async ({ id, payload }: UpdateHasanaatItemPayload): Promise<DeedItem> => {
  const { data } = await axios.patch<DeedItem>(`${patch_deeds_hasanaat_items}/${id}`, payload);
  return data;
};

export const deleteHasanaatItem = async (id: string): Promise<void> => {
  await axios.delete(`${delete_deeds_hasanaat_items}/${id}`);
};


export const updateHasanaatItemDisplayOrder = async (payload: UpdateHasanaatItemDisplayOrderPayload): Promise<void> => {
  await axios.patch(patch_deeds_hasanaat_items_display_order, payload);
};