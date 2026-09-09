export interface RecordPayload {
  date: string;
  deed_item_id: string;
  count_value?: number | null;
  scale_item_id?: string | null;
}

export interface CreateRecordsPayload {
  records: RecordPayload[];
}

export interface RecordResponse {
  date: string;
  user_id?: string;
  record_id?: string;
  created_at?: string;
  updated_at?: string;
  deed_item_id: string;
  count_value?: number | null;
  scale_item_id?: string | null;
}

export interface GetRecordsRangeParams {
  end_date: string;
  start_date: string;
}

export interface DeedScaleItem {
  name: string;
  count: number;
  percentage: number;
  scale_item_id: number | string;
}

export interface DeedDailyCount {
  date: string;
  count: number;
}

export interface DeedRangeChild {
  name: string;
  total: number;
  deed_item_id: number | string;
  scales: DeedScaleItem[] | null;
  daily_counts: DeedDailyCount[] | null;
  type: 'scale' | 'count' | string | null;
}

export interface DeedRangeItem extends DeedRangeChild {
  children?: DeedRangeChild[];
}

export type RecordsRangeResponse = DeedRangeItem[];