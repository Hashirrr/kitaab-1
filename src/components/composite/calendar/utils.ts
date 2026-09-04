import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import { CalendarDay, HandleJumpToLatestProps, HandleSelectDateProps } from './interface';

const TOTAL_CALENDAR_CELLS = 42;
export const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const generateCalendarMatrix = (currentMonth: dayjs.Dayjs, selectedDate: dayjs.Dayjs, latestRecordedDate?: string): CalendarDay[] => {
  const startOfMonth = currentMonth.startOf('month');
  const startDayOfWeek = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();

  const days: CalendarDay[] = [];
  const latestDateObj = latestRecordedDate ? dayjs(latestRecordedDate) : null;

  const prevMonth = currentMonth.subtract(1, 'month');
  const daysInPrevMonth = prevMonth.daysInMonth();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonth.date(daysInPrevMonth - i);
    days.push({
      date: d.toDate(),
      isCurrentMonth: false,
      dayNumber: daysInPrevMonth - i,
      isToday: d.isSame(dayjs(), 'day'),
      isSelected: d.isSame(selectedDate, 'day'),
      isLatest: Boolean(latestDateObj && d.isSame(latestDateObj, 'day'))
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = currentMonth.date(i);
    days.push({
      date: d.toDate(),
      dayNumber: i,
      isCurrentMonth: true,
      isToday: d.isSame(dayjs(), 'day'),
      isSelected: d.isSame(selectedDate, 'day'),
      isLatest: Boolean(latestDateObj && d.isSame(latestDateObj, 'day'))
    });
  }

  const remainingCells = TOTAL_CALENDAR_CELLS - days.length;
  const nextMonth = currentMonth.add(1, 'month');
  for (let i = 1; i <= remainingCells; i++) {
    const d = nextMonth.date(i);
    days.push({
      dayNumber: i,
      date: d.toDate(),
      isCurrentMonth: false,
      isToday: d.isSame(dayjs(), 'day'),
      isSelected: d.isSame(selectedDate, 'day'),
      isLatest: Boolean(latestDateObj && d.isSame(latestDateObj, 'day'))
    });
  }

  return days;
};

export const handlePrevYear = (setCurrentMonth: Dispatch<SetStateAction<Dayjs>>) => {
  setCurrentMonth(prev => prev.subtract(1, 'year'));
};

export const handleNextYear = (setCurrentMonth: Dispatch<SetStateAction<Dayjs>>) => {
  setCurrentMonth(prev => prev.add(1, 'year'));
};

export const handlePrevMonth = (setCurrentMonth: Dispatch<SetStateAction<Dayjs>>) => {
  setCurrentMonth(prev => prev.subtract(1, 'month'));
};

export const handleNextMonth = (setCurrentMonth: Dispatch<SetStateAction<Dayjs>>) => {
  setCurrentMonth(prev => prev.add(1, 'month'));
};

export const handleSelectDate = ({ date, onChange, setSelectedDate, setCurrentMonth }: HandleSelectDateProps) => {
  const d = dayjs(date);
  setSelectedDate(d);
  setCurrentMonth(d);
  onChange?.(date);
};

export const handleJumpToSelected = (selectedDate: dayjs.Dayjs, setCurrentMonth: Dispatch<SetStateAction<Dayjs>>) => setCurrentMonth(selectedDate);

export const handleJumpToLatest = ({ latestRecordedDate, onChange, setSelectedDate, setCurrentMonth }: HandleJumpToLatestProps) => {
  const d = dayjs(latestRecordedDate);
  setSelectedDate(d);
  setCurrentMonth(d);
  onChange?.(d.toDate());
};