export const isChecked = (checkedRecord: Record<string, boolean>, key: string): boolean => {
  return checkedRecord[key] !== undefined ? checkedRecord[key] : true;
};
