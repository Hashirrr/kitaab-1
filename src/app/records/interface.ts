import { DeedTypes } from '@/constants/enums';
import { Dispatch, SetStateAction } from 'react';
import { CreateRecordsPayload } from '@/hooks/records/interface';

export const NOT_SELECTED = 'Not Selected';

export interface DeedRecordItem {
  id: string;
  name: string;
  unit?: string;
  type: DeedTypes;
  options?: string[];
  selectedOption?: string;
  countValue?: number | null;
  children?: DeedRecordItem[];
  scale_item_id?: string | null;
}

export interface RecordCardProps {
  deed: DeedRecordItem;
  onUpdateCount?: (deedId: string, count: number | null) => void;
  onUpdateSubDeedCount?: (deedId: string, subDeedId: string, count: number | null) => void;
  onUpdateOption?: (deedId: string, option: string, scaleItemId?: string | null) => void;
  onUpdateSubDeedOption?: (deedId: string, subDeedId: string, option: string, scaleItemId?: string | null) => void;
}

export interface RecordCardsProps {
  selectedDate?: Date | null;
  latestRecordedDate?: string;
  onSaveSuccess?: (savedDate: Date) => void;
}

export interface HandleUpdateSubDeedOptionProps {
  deedId: string;
  option: string;
  subDeedId: string;
  scaleItemId?: string | null;
  setDeeds: Dispatch<SetStateAction<DeedRecordItem[]>>;
}

export interface HandleUpdateSubDeedCountProps {
  deedId: string;
  subDeedId: string;
  count: number | null;
  setDeeds: Dispatch<SetStateAction<DeedRecordItem[]>>;
}

export interface HandleUpdateOptionProps {
  deedId: string;
  option: string;
  scaleItemId?: string | null;
  setDeeds: Dispatch<SetStateAction<DeedRecordItem[]>>;
}

export interface HandleUpdateCountProps {
  deedId: string;
  count: number | null;
  setDeeds: Dispatch<SetStateAction<DeedRecordItem[]>>;
}

export interface HandleSaveSuccessProps {
  savedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
}

export interface HandleDateChangeProps {
  date: Date;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
  isInitializedRef: React.MutableRefObject<boolean>;
}

export interface HandleSaveProps {
  formattedDate: string;
  deeds: DeedRecordItem[];
  selectedDate?: Date | null;
  onSaveSuccess?: (savedDate: Date) => void;
  createRecords: (payload: CreateRecordsPayload) => Promise<unknown>;
}