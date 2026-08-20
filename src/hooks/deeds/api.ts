import axios from '../axios';
import { ENDPOINTS } from '@/constants/endpoints';
import deeds from '@/mock/deeds.json' with { type: 'json' };
import { GetHasanaatItemsResponse, CreateHasanaatItemPayload, DeedItem, UpdateDeedPayload, UpdateDeedsDisplayOrderPayload } from './interface';

const {
  get_deeds,
  update_deed,
  delete_deed,
  create_deeds,
  update_deeds_display_order
} = ENDPOINTS;

export const getDeeds = async (type: string): Promise<GetHasanaatItemsResponse> => {
  try {
    const { data } = await axios.get<GetHasanaatItemsResponse>(get_deeds(type));
    data.sort((a, b) => Number(a.display_order) - Number(b.display_order));
    return data;
  } catch {
    return deeds as GetHasanaatItemsResponse;
  }
};

export const createDeed = async (type: string, payload: CreateHasanaatItemPayload): Promise<GetHasanaatItemsResponse> => {
  const { data } = await axios.post<GetHasanaatItemsResponse>(create_deeds(type), payload);
  return data;
};

export const updateDeed = async ( id: string, type: string, payload : UpdateDeedPayload): Promise<DeedItem> => {
  const { data } = await axios.patch<DeedItem>(update_deed(id, type), payload);
  return data;
};

export const deleteDeed = async (id: string, type: string): Promise<void> => {
  await axios.delete(delete_deed(id, type));
};


export const updateDeedsDisplayOrder = async (type: string, payload: UpdateDeedsDisplayOrderPayload): Promise<void> => {
  await axios.patch(update_deeds_display_order(type), payload);
};