export interface ChartDataPoint {
  y: number;
  z: number;
  name: string;
  color?: string;
  visible?: boolean;
  showInLegend?: boolean;
  dataLabels?: {
    enabled: boolean;
  };
}

export type ScaleCountsObject = Record<string, number>;

export interface ChartProps {
  errorMessage?: string | null;
  checkedScales?: Record<string, boolean>;
  checkedSubDeeds?: Record<string, boolean>;
  onToggleScale?: (scaleName: string, isChecked: boolean) => void;
}