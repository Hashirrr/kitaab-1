import axios from '../axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { CreateRecordsPayload, RecordResponse } from './interface';

const { create_records, get_records } = ENDPOINTS;

export const getRecordsByDate = async (date: string): Promise<RecordResponse[]> => {
  const { data } = await axios.get<RecordResponse[]>(get_records(date));
  return data;
};

export const createRecords = async (payload: CreateRecordsPayload): Promise<RecordResponse[]> => {
  const { data } = await axios.post<RecordResponse[]>(create_records, payload);
  return data;
};