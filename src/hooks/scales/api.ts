import axios from '../axios';
import { CreateScaleItemPayload, ScaleItem } from './interface';
import { ENDPOINTS } from "@/constants/endpoints";

const { get_scales, create_scales } = ENDPOINTS;

export const getScales = async (id: string): Promise<ScaleItem[]> => {
  const { data } = await axios.get<ScaleItem[]>(get_scales(id));
  data.sort((a, b) => Number(a.display_order) - Number(b.display_order));
  return data;
};

export const createScales = async (id: string, payload: CreateScaleItemPayload[]): Promise<CreateScaleItemPayload[]> => {
  const { data } = await axios.post<CreateScaleItemPayload[]>(create_scales(id), { items: payload });
  return data;
};