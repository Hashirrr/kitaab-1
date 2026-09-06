import type * as Highcharts from 'highcharts';
import { PLACEHOLDERS } from '@/constants/placeholders';
import type { ChartDataPoint, ScaleCountsObject } from './interface';

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

export const getScalesObject = (scales?: Array<{ name: string }>, fallback: ScaleCountsObject = DEFAULT_SCALE_COUNTS): ScaleCountsObject => {
  if (!scales || scales.length === 0) return fallback;

  const result: ScaleCountsObject = {};
  scales.forEach((scale, index) => result[scale.name] = fallback[scale.name] ?? (25 - (index % 5) * 3));
  return result;
};

export const formatChartDataFromObject = (scalesObject: ScaleCountsObject = DEFAULT_SCALE_COUNTS): ChartDataPoint[] => {
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