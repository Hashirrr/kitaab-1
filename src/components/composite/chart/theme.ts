import { Mode } from '@/constants/enums';
import type * as Highcharts from 'highcharts';
import type { ChartDataPoint } from './interface';
import { formatChartDataFromObject, getScaleOpacities } from './utils';

export const getChartColors = (mode: Mode = Mode.light, count: number = 4): string[] => {
  const isDark = mode === Mode.dark;
  const opacities = getScaleOpacities(count);
  const rgb = isDark ? '255, 255, 255' : '0, 0, 0';
  return opacities.map((opacity) => `rgba(${rgb}, ${opacity})`);
};

export const getDefaultChartOptions = (mode: Mode = Mode.light, data: ChartDataPoint[] = formatChartDataFromObject(), isMobile?: boolean, isTablet?: boolean, onToggleScale?: (scaleName: string, isChecked: boolean) => void): Highcharts.Options => {
  const isDark = mode === Mode.dark;
  const borderRadius = isMobile ? 5 : 10;
  const textColor = 'var(--foreground-1)';
  const labelColor = 'var(--foreground-2)';
  const defaultDataLabelsEnabled = !isTablet;
  const defaultSize = isTablet ? '100%' : '80%';
  const colors = getChartColors(mode, data.length);
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';

  return {
    chart: {
      type: 'variablepie',
      backgroundColor: 'transparent'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    colors,
    tooltip: {
      headerFormat: '',
      pointFormatter: function (this: Highcharts.Point) {
        const pct = typeof this.percentage === 'number' ? this.percentage % 1 === 0 ? this.percentage.toFixed(0) : this.percentage.toFixed(1) : '0';
        return (
          `<span style="color:${this.color}">\u25CF</span> <b>${this.name}</b><br/>` +
          `Value: <b>${Math.round(this.y || 0)}</b><br/>` +
          `Percentage: <b>${pct}%</b><br/>`
        );
      },
      borderColor: 'var(--background-2)',
      backgroundColor: 'var(--background-3)',
      style: {
        color: textColor
      }
    },
    plotOptions: {
      variablepie: {
        borderColor,
        borderRadius,
        borderWidth: 1,
        size: defaultSize,
        point: {
          events: {
            legendItemClick: function () {
              const chart = this.series.chart;
              onToggleScale?.(this.name, !this.visible);
              setTimeout(() => {
                chart.pointer?.reset?.();
              }, 0);
            }
          }
        },
        dataLabels: {
          padding: 4,
          borderWidth: 1,
          borderRadius: 4,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 0
          },
          borderColor: 'var(--background-1)',
          backgroundColor: 'var(--background-3)',
          style: {
            color: labelColor,
            fontWeight: 'bold',
            fontStyle: 'italic',
            textOutline: 'none'
          },
          enabled: defaultDataLabelsEnabled
        }
      }
    },
    series: [
      {
        data,
        zMin: 0,
        borderColor,
        borderRadius,
        name: 'scales',
        borderWidth: 1,
        minPointSize: 10,
        innerSize: '30%',
        size: defaultSize,
        showInLegend: true,
        type: 'variablepie'
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1024
          },
          chartOptions: {
            legend: {
              enabled: false
            },
            plotOptions: {
              variablepie: {
                size: '100%',
                borderRadius: 5,
                dataLabels: {
                  enabled: false,
                }
              }
            }
          }
        }
      ]
    }
  };
};