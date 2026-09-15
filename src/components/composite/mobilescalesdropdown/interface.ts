export interface MobileScalesDropdownProps {
  scales: string[];
  isPending: boolean;
  checkedScales: Record<string, boolean>;
  onToggleScale: (scale: string) => void;
}
