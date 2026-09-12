import { Mode } from '@/constants/enums';
import type * as Highcharts from 'highcharts';
import { LineChartSeries } from './interface';

export const getLineColors = (mode: Mode = Mode.light, count: number = 1): string[] => {
  if (count <= 1) {
    return ['var(--foreground-1)'];
  }

  const palette = [
    'var(--foreground-1)',
    'var(--foreground-2)',
    'var(--foreground-3)',
    'var(--background-1)'
  ];

  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

export const getDefaultLineChartOptions = (mode: Mode = Mode.light, seriesData: LineChartSeries[] = [], isMobile?: boolean, onToggleSeries?: (seriesName: string, isVisible: boolean) => void): Highcharts.Options => {
  const isDark = mode === Mode.dark;
  const textColor = 'var(--foreground-1)';
  const labelColor = 'var(--foreground-3)';
  const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const axisLineColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)';
  const colors = getLineColors(mode, seriesData.length);

  return {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      },
      spacing: [16, 12, 12, 12]
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
      shared: true,
      useHTML: true,
      xDateFormat: '%a, %b %e, %Y',
      backgroundColor: 'var(--background-3)',
      borderColor: 'var(--background-2)',
      borderRadius: 8,
      shadow: true,
      style: {
        color: textColor,
        fontSize: '12px'
      },
      headerFormat: '<span style="font-size: 11px; color: var(--foreground-3); font-weight: 500;">{point.key}</span><br/>',
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b>{series.name}</b>: <b>{point.y}</b><br/>'
    },
    xAxis: {
      type: 'datetime',
      crosshair: {
        width: 1,
        color: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.16)',
        dashStyle: 'Dash',
        zIndex: 3
      },
      lineColor: axisLineColor,
      tickColor: axisLineColor,
      gridLineColor: 'transparent',
      labels: {
        style: {
          color: labelColor,
          fontSize: isMobile ? '10px' : '11px'
        }
      }
    },
    yAxis: {
      title: {
        text: ''
      },
      min: 0,
      allowDecimals: false,
      gridLineColor,
      labels: {
        style: {
          color: labelColor,
          fontSize: isMobile ? '10px' : '11px'
        }
      }
    },
    plotOptions: {
      spline: {
        lineWidth: 2.5,
        marker: {
          enabled: false,
          radius: 3.5,
          lineWidth: 0,
          fillColor: seriesData.length <= 1 ? 'var(--foreground-1)' : undefined,
          states: {
            hover: {
              enabled: true,
              radius: 5,
              lineWidth: 0,
              fillColor: seriesData.length <= 1 ? 'var(--foreground-1)' : undefined
            }
          }
        },
        states: {
          hover: {
            lineWidth: 2.5,
            halo: {
              size: 0
            }
          }
        },
        point: {
          events: {
            legendItemClick: function () {
              onToggleSeries?.(this.series.name, !this.series.visible);
            }
          }
        }
      }
    },
    series: seriesData.map((s, index) => ({
      type: 'spline',
      id: s.id,
      name: s.name,
      data: s.data,
      visible: s.visible !== false,
      color: s.color || colors[index % colors.length],
    })) as Highcharts.SeriesOptionsType[],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 768
          },
          chartOptions: {
            chart: {
              spacing: [8, 6, 8, 6]
            },
            plotOptions: {
              spline: {
                lineWidth: 2
              }
            }
          }
        }
      ]
    }
  };
};
