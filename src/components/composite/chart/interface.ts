export interface ChartDataPoint {
  y: number;
  z: number;
  name: string;
  color?: string;
  visible?: boolean;
}

export type ScaleCountsObject = Record<string, number>;

export interface ChartProps {
  checkedScales?: Record<string, boolean>;
  onToggleScale?: (scaleName: string, isChecked: boolean) => void;
}