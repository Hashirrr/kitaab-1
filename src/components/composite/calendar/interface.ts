import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

export interface CalendarProps {
  latestRecordedDate?: string;
  value?: Date | string | null;
  onChange?: (date: Date) => void;
}

export interface CalendarDay {
  date: Date;
  isToday: boolean;
  isLatest?: boolean;
  dayNumber: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
}

export interface HandleSelectDateProps {
  date: Date;
  onChange?: (date: Date) => void;
  setCurrentMonth: Dispatch<SetStateAction<Dayjs>>;
  setSelectedDate: Dispatch<SetStateAction<Dayjs | null>>;
}

export interface HandleJumpToLatestProps {
  onChange?: (date: Date) => void;
  latestRecordedDate: string;
  setCurrentMonth: Dispatch<SetStateAction<Dayjs>>;
  setSelectedDate: Dispatch<SetStateAction<Dayjs | null>>;
}
