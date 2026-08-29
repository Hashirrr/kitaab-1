import axios from '../axios';
import { ENDPOINTS } from "@/constants/endpoints";
import { CreateScaleItemPayload, ScaleItem, UpdateScaleItemPayload, UpdateScalesDisplayOrderPayload } from './interface';

const { get_scales, create_scales, update_scale, delete_scale, update_scales_display_order } = ENDPOINTS;

export const getScales = async (id: string): Promise<ScaleItem[]> => {
  const { data } = await axios.get<ScaleItem[]>(get_scales(id));
  data.sort((a, b) => Number(a.display_order) - Number(b.display_order));
  return data;
};

export const createScales = async (id: string, payload: CreateScaleItemPayload[]): Promise<CreateScaleItemPayload[]> => {
  const { data } = await axios.post<CreateScaleItemPayload[]>(create_scales(id), { items: payload });
  return data;
};

export const updateScale = async (scaleId: string, itemId: string, payload: UpdateScaleItemPayload): Promise<ScaleItem> => {
  const { data } = await axios.patch<ScaleItem>(update_scale(scaleId, itemId), payload);
  return data;
};

export const deleteScale = async (scaleId: string, itemId: string): Promise<void> => {
  await axios.delete(delete_scale(scaleId, itemId));
};

export const updateScalesDisplayOrder = async (scaleId: string, payload: UpdateScalesDisplayOrderPayload): Promise<void> => {
  await axios.patch(update_scales_display_order(scaleId), payload);
};