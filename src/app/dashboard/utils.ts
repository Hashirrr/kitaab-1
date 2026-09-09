import dayjs from 'dayjs';

export const TIME_RANGE_OPTIONS = [
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'Last 1 Year', value: 'last_1_year' }
];

export const getDateRangeFromTimeRange = (timeRange: string): { startDate: string; endDate: string } => {
  const end = dayjs();
  let start = end.subtract(30, 'day');
  if (timeRange === 'last_1_year') start = end.subtract(1, 'year');
  return {
    endDate: end.format('YYYY-MM-DD'),
    startDate: start.format('YYYY-MM-DD')
  };
};

export const isChecked = (checkedRecord: Record<string, boolean>, key: string): boolean => {
  return checkedRecord[key] !== undefined ? checkedRecord[key] : true;
};

export const toggleChecked = (prev: Record<string, boolean>, key: string, isCheckedExplicit?: boolean): Record<string, boolean> => ({
  ...prev,
  [key]: isCheckedExplicit !== undefined ? isCheckedExplicit : !isChecked(prev, key)
});