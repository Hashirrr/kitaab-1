import { Mode } from '@/constants/enums';
import type * as Highcharts from 'highcharts';
import { LineChartSeries } from './interface';

export const getLineColors = (mode: Mode = Mode.light, count: number = 1): string[] => {
  const isDark = mode === Mode.dark;

  if (count <= 1) {
    return [isDark ? '#818cf8' : '#6366f1'];
  }

  // Bright, luminous, similar-tone palette in the Electric Indigo -> Sky -> Cyan spectrum
  if (count === 2) {
    return isDark ? ['#818cf8', '#38bdf8'] : ['#6366f1', '#0ea5e9'];
  }
  if (count === 3) {
    return isDark ? ['#818cf8', '#60a5fa', '#22d3ee'] : ['#6366f1', '#3b82f6', '#06b6d4'];
  }
  if (count === 4) {
    return isDark
      ? ['#a78bfa', '#818cf8', '#38bdf8', '#22d3ee']
      : ['#8b5cf6', '#6366f1', '#0ea5e9', '#06b6d4'];
  }
  if (count === 5) {
    return isDark
      ? ['#c084fc', '#818cf8', '#60a5fa', '#38bdf8', '#22d3ee']
      : ['#a855f7', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4'];
  }

  const lightTones = ['#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0284c7', '#0ea5e9', '#06b6d4', '#14b8a6'];
  const darkTones = ['#c084fc', '#a78bfa', '#818cf8', '#60a5fa', '#38bdf8', '#22d3ee', '#2dd4bf', '#34d399'];
  const palette = isDark ? darkTones : lightTones;

  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

export const getDefaultLineChartOptions = (
  mode: Mode = Mode.light,
  seriesData: LineChartSeries[] = [],
  isMobile?: boolean,
  onToggleSeries?: (seriesName: string, isVisible: boolean) => void
): Highcharts.Options => {
  const isDark = mode === Mode.dark;
  const textColor = 'var(--foreground-1)';
  const labelColor = 'var(--foreground-3)';
  const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.05)';
  const axisLineColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.08)';
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
      backgroundColor: isDark ? '#131b2e' : '#ffffff',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.1)',
      borderRadius: 8,
      shadow: true,
      style: {
        color: textColor,
        fontSize: '12px',
        fontFamily: 'inherit'
      },
      headerFormat:
        '<span style="font-size: 11px; color: var(--foreground-3); font-weight: 600;">{point.key}</span><br/>',
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b>{series.name}</b>: <b>{point.y}</b><br/>'
    },
    xAxis: {
      type: 'datetime',
      crosshair: {
        width: 1,
        color: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(15, 23, 42, 0.18)',
        dashStyle: 'Dash',
        zIndex: 3
      },
      lineColor: axisLineColor,
      tickColor: axisLineColor,
      gridLineColor: 'transparent',
      labels: {
        style: {
          color: labelColor,
          fontSize: isMobile ? '10px' : '11px',
          fontFamily: 'inherit'
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
          fontSize: isMobile ? '10px' : '11px',
          fontFamily: 'inherit'
        }
      }
    },
    plotOptions: {
      spline: {
        lineWidth: 2.5,
        marker: {
          enabled: false,
          radius: 4,
          lineWidth: 0,
          states: {
            hover: {
              enabled: true,
              radius: 5.5,
              lineWidth: 0
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
    series: seriesData.map((s, index) => {
      const lineColor = s.color || colors[index % colors.length];
      return {
        type: 'spline',
        id: s.id,
        name: s.name,
        data: s.data,
        visible: s.visible !== false,
        color: lineColor,
        marker: {
          enabled: false,
          radius: 4,
          lineWidth: 0,
          fillColor: lineColor,
          states: {
            hover: {
              enabled: true,
              radius: 5.5,
              lineWidth: 0,
              fillColor: lineColor
            }
          }
        }
      };
    }) as Highcharts.SeriesOptionsType[],
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
