import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';

export interface CalendarProps {
  value?: Date | string;
  onChange?: (date: Date) => void;
  latestRecordedDate?: string;
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
  setSelectedDate: Dispatch<SetStateAction<Dayjs>>;
  setCurrentMonth: Dispatch<SetStateAction<Dayjs>>;
}

export interface HandleJumpToLatestProps {
  onChange?: (date: Date) => void;
  latestRecordedDate: string;
  setSelectedDate: Dispatch<SetStateAction<Dayjs>>;
  setCurrentMonth: Dispatch<SetStateAction<Dayjs>>;
}
