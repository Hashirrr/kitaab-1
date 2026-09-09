import axios from '../axios';
import { ENDPOINTS } from '@/constants/endpoints';
import { CreateRecordsPayload, RecordResponse, RecordsRangeResponse } from './interface';

const { create_records, get_records, get_records_range } = ENDPOINTS;

export const getRecordsByDate = async (date: string): Promise<RecordResponse[]> => {
  const { data } = await axios.get<RecordResponse[]>(get_records(date));
  return data;
};

export const createRecords = async (payload: CreateRecordsPayload): Promise<RecordResponse[]> => {
  const { data } = await axios.post<RecordResponse[]>(create_records, payload);
  return data;
};

export const getRecordsRange = async (startDate: string, endDate: string): Promise<RecordsRangeResponse> => {
  const { data } = await axios.get<RecordsRangeResponse>(get_records_range(startDate, endDate));
  return data;
};