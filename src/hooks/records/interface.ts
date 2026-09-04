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