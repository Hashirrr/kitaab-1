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

export const getDefaultChartOptions = (mode: Mode = Mode.light, data: ChartDataPoint[] = formatChartDataFromObject(), isMobile?: boolean, onToggleScale?: (scaleName: string, isChecked: boolean) => void): Highcharts.Options => {
  const isDark = mode === Mode.dark;
  const borderRadius = isMobile ? 5 : 10;
  const textColor = 'var(--foreground-1)';
  const labelColor = 'var(--foreground-2)';
  const defaultDataLabelsEnabled = !isMobile;
  const defaultSize = isMobile ? '100%' : '80%';
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
      align: 'center',
      layout: 'horizontal',
      verticalAlign: 'bottom',
      enabled: Boolean(isMobile),
      itemStyle: {
        color: textColor,
        fontSize: '12px',
        fontWeight: 'normal'
      },
      itemHoverStyle: {
        color: isDark ? '#ffffff' : '#000000'
      }
    },
    colors,
    tooltip: {
      headerFormat: '',
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b>{point.name}</b><br/>' +
        'Value: <b>{point.y:.0f}</b><br/>' +
        'Weight: <b>{point.z}</b><br/>',
        borderColor: 'var(--background-2)',
      backgroundColor: 'var(--background-3)',
      style: {
        color: textColor
      }
    },
    plotOptions: {
      series: {
        states: {
          inactive: {
            opacity: 1
          }
        }
      },
      variablepie: {
        borderColor,
        borderRadius,
        borderWidth: 1,
        size: defaultSize,
        states: {
          inactive: {
            opacity: 1
          }
        },
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
            maxWidth: 768
          },
          chartOptions: {
            legend: {
              enabled: true,
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
              itemStyle: {
                color: textColor,
                fontWeight: 'normal',
                fontSize: '12px'
              },
              itemHoverStyle: {
                color: isDark ? '#ffffff' : '#000000',
              }
            },
            plotOptions: {
              series: {
                states: {
                  inactive: {
                    opacity: 1
                  }
                }
              },
              variablepie: {
                size: '100%',
                borderRadius: 5,
                states: {
                  inactive: {
                    opacity: 1
                  }
                },
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