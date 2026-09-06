'use client';

import styles from './chart.module.css';
import type * as Highcharts from 'highcharts';
import type { ChartProps } from './interface';
import { useAppSelector } from '@/store/hooks';
import { useGetScales } from '@/hooks/scales/hook';
import { useIsMobile } from '@/store/slices/utils';
import { EventListeners } from '@/constants/enums';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from '@/components/primitive/skeleton/Skeleton';
import { getDefaultChartOptions, getChartColors } from './theme';
import { selectCurrentDeedId, selectMode } from '@/store/slices/selectors';
import { formatChartDataFromObject, getScalesObject, loadHighcharts } from './utils';

export default function Chart({ checkedScales, onToggleScale }: ChartProps = {}) {
  const isMobile = useIsMobile();
  const mode = useAppSelector(selectMode);
  const chartRef = useRef<Highcharts.Chart | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentDeedId = useAppSelector(selectCurrentDeedId);
  const [isHighchartsLoading, setIsHighchartsLoading] = useState(true);
  const { data: scales, isPending: isScalesPending } = useGetScales(currentDeedId);

  const chartData = useMemo(() => {
    const scalesObject = getScalesObject(scales);
    const data = formatChartDataFromObject(scalesObject);
    const colors = getChartColors(mode, data.length);
    return data.map((point, index) => ({
      ...point,
      color: colors[index],
      visible: checkedScales?.[point.name] !== undefined ? checkedScales[point.name] : true,
    }));
  }, [scales, mode]);

  const chartOptions = useMemo(() => {
    return getDefaultChartOptions(mode, chartData, isMobile, onToggleScale);
  }, [mode, chartData, isMobile, onToggleScale]);

  useEffect(() => {
    let isMounted = true;

    loadHighcharts()
      .then((Highcharts) => {
        if (!isMounted || !containerRef.current) return;

        if (!chartRef.current) {
          chartRef.current = Highcharts.chart(containerRef.current, chartOptions);
          setIsHighchartsLoading(false);

          if (checkedScales) {
            const series = chartRef.current.series[0];
            if (series?.points) {
              let hasChanged = false;
              series.points.forEach((point: Highcharts.Point) => {
                const isChecked = checkedScales[point.name] !== undefined ? checkedScales[point.name] : true;
                if (point.visible !== isChecked) {
                  point.setVisible(isChecked, false);
                  hasChanged = true;
                }
              });
              if (hasChanged) {
                chartRef.current.redraw();
              }
            }
          }
        } else {
          chartRef.current.update(chartOptions, true, true);
        }
      })
      .catch((err) => {
        console.error(PLACEHOLDERS.FAILED_TO_LOAD_HIGHCHARTS, err);
        if (isMounted) {
          setIsHighchartsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [chartOptions]);

  useEffect(() => {
    if (!chartRef.current || !checkedScales) return;
    const series = chartRef.current.series[0];
    if (!series?.points) return;

    let hasChanged = false;
    series.points.forEach((point: Highcharts.Point) => {
      const isChecked = checkedScales[point.name] !== undefined ? checkedScales[point.name] : true;
      if (point.visible !== isChecked) {
        point.setVisible(isChecked, false);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      chartRef.current.redraw();
    }
  }, [checkedScales]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.reflow();
      }
    };

    window.addEventListener(EventListeners.resize, handleResize);

    return () => {
      window.removeEventListener(EventListeners.resize, handleResize);
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const showSkeleton = isHighchartsLoading || Boolean(currentDeedId && isScalesPending && !scales);

  return (
    <div className={styles.container}>
      {showSkeleton && <Skeleton className={styles.skeleton} />}
      <div ref={containerRef} className={styles.chart} />
    </div>
  );
};