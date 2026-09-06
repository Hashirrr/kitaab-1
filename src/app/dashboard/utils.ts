export const TIME_RANGE_OPTIONS = [
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'Last 1 Year', value: 'last_1_year' }
];

export const isChecked = (checkedRecord: Record<string, boolean>, key: string): boolean => {
  return checkedRecord[key] !== undefined ? checkedRecord[key] : true;
};

export const toggleChecked = (prev: Record<string, boolean>, key: string, isCheckedExplicit?: boolean): Record<string, boolean> => ({
  ...prev,
  [key]: isCheckedExplicit !== undefined ? isCheckedExplicit : !isChecked(prev, key)
});