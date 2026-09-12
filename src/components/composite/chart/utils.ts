import type * as Highcharts from 'highcharts';
import type { DeedItem } from '@/hooks/deeds/interface';
import { PLACEHOLDERS } from '@/constants/placeholders';
import type { ScaleItem } from '@/hooks/scales/interface';
import type { ChartDataPoint, ScaleCountsObject } from './interface';
import type { DeedRangeChild, DeedRangeItem } from '@/hooks/records/interface';

const { UNDEFINED } = PLACEHOLDERS;
let highchartsPromise: Promise<typeof Highcharts> | null = null;

export const loadHighcharts = async (): Promise<typeof Highcharts> => {
  if (!highchartsPromise) {
    highchartsPromise = (async () => {
      const Highcharts = (await import('highcharts')).default;

      if (typeof window !== UNDEFINED) {
        (window as unknown as { _Highcharts?: typeof Highcharts; Highcharts?: typeof Highcharts }).Highcharts = Highcharts;
        (window as unknown as { _Highcharts?: typeof Highcharts; Highcharts?: typeof Highcharts })._Highcharts = Highcharts;
      }

      const [variablePie, accessibility] = await Promise.all([
        import('highcharts/modules/variable-pie'),
        import('highcharts/modules/accessibility'),
      ]);

      const initModule = (mod: unknown) => {
        if (typeof mod === 'function') {
          (mod as (H: typeof Highcharts) => void)(Highcharts);
        }
      };

      initModule(variablePie.default);
      initModule(accessibility.default);

      const H = Highcharts as any;
      const pieProto = H.seriesTypes?.pie?.prototype;
      if (pieProto && typeof H.wrap === 'function') {
        H.wrap(pieProto, 'redrawPoints', function (this: any, proceed: () => void) {
          const wasHiding = this.points?.map((point: any) => {
            const graphic = point.graphic;
            return Boolean(graphic && graphic.visibility !== 'hidden' && !point.visible);
          });

          proceed.call(this);

          const duration = typeof this.chart?.renderer?.globalAnimation === 'object'
            ? (this.chart.renderer.globalAnimation.duration ?? 500)
            : 500;

          this.points?.forEach((point: any, index: number) => {
            const graphic = point.graphic;
            if (wasHiding?.[index] && graphic) {
              graphic.attr({ visibility: 'inherit' });

              setTimeout(() => {
                if (!point.visible && point.graphic) {
                  point.graphic.attr({ visibility: 'hidden' });
                }
              }, duration);
            }
          });
        });
      }

      return Highcharts;
    })();
  }

  return highchartsPromise;
};

export const DEFAULT_CHART_WEIGHT = 100;

export const DEFAULT_SCALE_COUNTS: ScaleCountsObject = {
  'In Mosque': 24,
  'In Time': 13,
  'Late': 27,
  'Missed': 11,
};

export const getScalesRecordData = (scales?: ScaleItem[], records?: DeedRangeItem[], currentDeedId?: string, checkedSubDeeds?: Record<string, boolean>): ScaleCountsObject => {
  const counts: ScaleCountsObject = getScalesObject(scales);

  if (!records || records.length === 0 || !currentDeedId)
    return counts;

  const currentRecord = records.find((r) => String(r.deed_item_id) === String(currentDeedId));

  if (!currentRecord)
    return counts;

  const scaleNames: string[] = [];
  if (scales && scales.length > 0) {
    scales.forEach((s) => {
      if (!scaleNames.includes(s.name)) scaleNames.push(s.name);
    });
  } else if (currentRecord.scales && currentRecord.scales.length > 0) {
    currentRecord.scales.forEach((s) => {
      if (!scaleNames.includes(s.name)) scaleNames.push(s.name);
    });
  } else if (currentRecord.children && currentRecord.children.length > 0) {
    currentRecord.children.forEach((child) => {
      child.scales?.forEach((s) => {
        if (!scaleNames.includes(s.name)) scaleNames.push(s.name);
      });
    });
  }

  if (scaleNames.length === 0) {
    return counts;
  }

  scaleNames.forEach((name) => {
    counts[name] = 0;
  });

  const children = currentRecord.children;
  const hasChildren = Boolean(children && children.length > 0);

  if (hasChildren && children) {
    const isSubDeedChecked = (child: DeedRangeChild): boolean => {
      if (!checkedSubDeeds) return true;
      const id = String(child.deed_item_id);
      if (checkedSubDeeds[id] !== undefined) return checkedSubDeeds[id];
      if (child.name && checkedSubDeeds[child.name] !== undefined) return checkedSubDeeds[child.name];
      return true;
    };

    const activeChildren = children.filter(isSubDeedChecked);

    if (activeChildren.length === 0) return counts;

    activeChildren.forEach((child) => {
      if (child.scales && Array.isArray(child.scales)) {
        child.scales.forEach((scale) => {
          counts[scale.name] = (counts[scale.name] || 0) + (scale.count || 0);
        });
      }
    });

    return counts;
  }

  if (currentRecord.scales && Array.isArray(currentRecord.scales)) {
    currentRecord.scales.forEach((scale) => {
      counts[scale.name] = (counts[scale.name] || 0) + (scale.count || 0);
    });

    return counts;
  }

  return counts;
};

export const getScalesObject = (scales?: Array<{ name: string }>): ScaleCountsObject => {
  if (!scales || scales.length === 0) return {};

  const result: ScaleCountsObject = {};
  scales.forEach((scale) => {
    result[scale.name] = 0;
  });
  return result;
};

export const formatChartDataFromObject = (scalesObject: ScaleCountsObject = {}): ChartDataPoint[] => {
  return Object.entries(scalesObject).map(([name, y]) => ({ y, name, z: DEFAULT_CHART_WEIGHT }));
};

export const getScaleOpacities = (count: number): number[] => {
  if (count <= 0) return [];
  const step = 20 / (count + 1);
  return Array.from({ length: count }, (_, i) => {
    const val = (i + 1) * step;
    return Number((val / 20).toFixed(4));
  });
};

export { getChartColors, getDefaultChartOptions } from './theme';