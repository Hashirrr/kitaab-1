'use client';

import clsx from 'clsx';
import styles from './chart.module.css';
import type * as Highcharts from 'highcharts';
import type { ChartProps } from './interface';
import { FiAlertCircle } from 'react-icons/fi';
import { useAppSelector } from '@/store/hooks';
import { useGetDeeds } from '@/hooks/deeds/hook';
import { useGetScales } from '@/hooks/scales/hook';
import { EventListeners } from '@/constants/enums';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { useGetRecordsRange } from '@/hooks/records/hook';
import { useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from '@/components/primitive/skeleton/Skeleton';
import { useIsMobile, useIsTablet } from '@/store/slices/utils';
import { getDefaultChartOptions, getChartColors } from './theme';
import { selectCurrentDeedId, selectEndDate, selectMode, selectStartDate } from '@/store/slices/selectors';
import { formatChartDataFromObject, getScalesRecordData, loadHighcharts, DEFAULT_SCALE_COUNTS } from './utils';

const SKELETON_LEGEND_WIDTHS = [75, 56, 42, 65];

export default function Chart({ checkedScales, checkedSubDeeds, errorMessage, onToggleScale }: ChartProps = {}) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const mode = useAppSelector(selectMode);
  const endDate = useAppSelector(selectEndDate);
  const startDate = useAppSelector(selectStartDate);
  const chartRef = useRef<Highcharts.Chart | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentDeedId = useAppSelector(selectCurrentDeedId);
  const { data: deeds, isPending: isDeedsPending } = useGetDeeds();
  const [isHighchartsLoading, setIsHighchartsLoading] = useState(true);
  const { data: scales, isPending: isScalesPending } = useGetScales(currentDeedId);
  const { data: records, isPending: isRecordsPending } = useGetRecordsRange(startDate, endDate);

  const hasDeeds = Boolean(deeds && deeds.length > 0);
  const isWaitingForInitialDeed = isDeedsPending || (hasDeeds && !currentDeedId);
  const isInitialLoading = isHighchartsLoading || isWaitingForInitialDeed;
  const isWaitingForScales = Boolean(currentDeedId && isScalesPending && !scales);
  const showSkeleton = (!chartRef.current && isInitialLoading) || isWaitingForScales;

  const currentDeed = deeds?.find((d) => String(d.deed_item_id) === String(currentDeedId));
  const hasSubDeeds = Boolean(currentDeed?.children && currentDeed.children.length > 0);

  const hasSelectedSubDeed = !hasSubDeeds || currentDeed!.children!.some((sub) => {
    const subId = String(sub.deed_item_id || sub.name);
    const byId = checkedSubDeeds?.[subId];
    const byName = sub.name ? checkedSubDeeds?.[sub.name] : undefined;
    if (byId !== undefined) return byId;
    if (byName !== undefined) return byName;
    return true;
  });

  const scaleNames = scales && scales.length > 0
    ? scales.map((s) => s.name)
    : Object.keys(DEFAULT_SCALE_COUNTS);

  const hasSelectedScale = scaleNames.length === 0 || scaleNames.some((name) => {
    return checkedScales?.[name] !== undefined ? checkedScales[name] : true;
  });

  let computedErrorMessage: string | null = null;
  if (!hasSelectedSubDeed && !hasSelectedScale)
    computedErrorMessage = PLACEHOLDERS.ERROR_NO_SUB_DEED_AND_SCALE_SELECTED;
  else if (!hasSelectedSubDeed)
    computedErrorMessage = PLACEHOLDERS.ERROR_NO_SUB_DEED_SELECTED;
  else if (!hasSelectedScale)
    computedErrorMessage = PLACEHOLDERS.ERROR_NO_SCALE_SELECTED;

  const activeErrorMessage = errorMessage !== undefined ? errorMessage : computedErrorMessage;

  const chartData = useMemo(() => {
    const scalesObject = getScalesRecordData(scales, records, currentDeedId, checkedSubDeeds);
    const data = formatChartDataFromObject(scalesObject);
    const colors = getChartColors(mode, data.length);
    return data.map((point, index) => {
      const hasValue = point.y > 0;
      return {
        ...point,
        color: colors[index],
        showInLegend: hasValue,
        dataLabels: {
          enabled: hasValue && !isTablet
        },
        visible: checkedScales?.[point.name] !== undefined ? checkedScales[point.name] : true,
      };
    });
  }, [scales, records, currentDeedId, deeds, checkedSubDeeds, mode, checkedScales, isTablet]);

  const legendItems = useMemo(() => {
    return chartData.filter((point) => point.showInLegend !== false);
  }, [chartData]);

  const chartOptions = useMemo(() => {
    return getDefaultChartOptions(mode, chartData, isMobile, isTablet, onToggleScale);
  }, [mode, chartData, isMobile, isTablet, onToggleScale]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, [currentDeedId]);

  useEffect(() => {
    let isMounted = true;

    if (isWaitingForInitialDeed || isWaitingForScales) {
      return;
    }

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
          if (chartRef.current.series?.[0]) {
            chartRef.current.series[0].setData(chartData as any, true, true);
          }
          chartRef.current.update(chartOptions, true, false);
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
  }, [chartOptions, isWaitingForInitialDeed, isWaitingForScales]);

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
    if (!showSkeleton && !activeErrorMessage && chartRef.current) {
      chartRef.current.reflow();
    }
  }, [showSkeleton, activeErrorMessage]);

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

  const handleLegendHover = (name: string, isHovering: boolean) => {
    const point = chartRef.current?.series[0]?.points?.find((p) => p.name === name);
    if (point) {
      point.setState(isHovering ? 'hover' : '');
    }
  };

  return (
    <div className={styles.container}>
      {showSkeleton && (
        <div className={styles.skeleton__container}>
          <div className={styles.skeleton__circle__wrapper}>
            <Skeleton className={styles.skeleton__circle} />
          </div>
          <div className={styles.skeleton__legend}>
            {SKELETON_LEGEND_WIDTHS.map((width, index) => (
              <div key={index} className={styles.skeleton__legend__item}>
                <Skeleton width={10} height={10} borderRadius={5} />
                <Skeleton width={width} height={12} borderRadius={4} />
              </div>
            ))}
          </div>
        </div>
      )}
      {!showSkeleton && activeErrorMessage && (
        <div className={styles.error__container}>
          <FiAlertCircle className={styles.error__icon} />
          <h4 className={styles.error__title}>{PLACEHOLDERS.SELECTION_REQUIRED}</h4>
          <p className={styles.error__description}>{activeErrorMessage}</p>
        </div>
      )}
      <div
        className={clsx(styles.content, {
          [styles.hidden]: Boolean(showSkeleton || activeErrorMessage)
        })}
      >
        <div className={styles.chart__area}>
          <div ref={containerRef} className={styles.chart} />
        </div>
        {legendItems.length > 0 && (
          <div className={styles.legend}>
            {legendItems.map((item) => {
              const isChecked = item.visible !== false;
              return (
                <button
                  key={item.name}
                  type="button"
                  className={clsx(styles.legend__item, {
                    [styles.hidden]: !isChecked
                  })}
                  onClick={() => onToggleScale?.(item.name, !isChecked)}
                  onMouseEnter={() => handleLegendHover(item.name, true)}
                  onMouseLeave={() => handleLegendHover(item.name, false)}
                >
                  <span
                    className={styles.legend__symbol}
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={styles.legend__label}>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};