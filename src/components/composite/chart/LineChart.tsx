'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import styles from './chart.module.css';
import { loadHighcharts } from './utils';
import type * as Highcharts from 'highcharts';
import { FiAlertCircle } from 'react-icons/fi';
import { useAppSelector } from '@/store/hooks';
import { useGetDeeds } from '@/hooks/deeds/hook';
import { EventListeners } from '@/constants/enums';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { useGetRecordsRange } from '@/hooks/records/hook';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LineChartProps, LineChartSeries } from './interface';
import Skeleton from '@/components/primitive/skeleton/Skeleton';
import { useIsMobile, useIsTablet } from '@/store/slices/utils';
import { getDefaultLineChartOptions, getLineColors } from './lineChartTheme';
import { selectCurrentDeedId, selectEndDate, selectMode, selectStartDate } from '@/store/slices/selectors';

export default function LineChart({ checkedSubDeeds, errorMessage }: LineChartProps = {}) {
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
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const { data: records, isPending: isRecordsPending } = useGetRecordsRange(startDate, endDate);
  
  const hasDeeds = Boolean(deeds && deeds.length > 0);
  const isWaitingForInitialDeed = isDeedsPending || (hasDeeds && !currentDeedId);

  const isInitialLoading = isHighchartsLoading || isWaitingForInitialDeed;
  const isWaitingForRecords = Boolean(hasDeeds && currentDeedId && isRecordsPending && !records);
  const showSkeleton = isDeedsPending || (hasDeeds && (isInitialLoading || isWaitingForRecords));

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

  let computedErrorMessage: string | null = null;
  if (hasDeeds && hasSubDeeds && !hasSelectedSubDeed) {
    computedErrorMessage = PLACEHOLDERS.ERROR_NO_SUB_DEED_SELECTED;
  }

  const activeErrorMessage = errorMessage !== undefined ? errorMessage : computedErrorMessage;

  const currentRecord = useMemo(() => {
    if (!records || !currentDeedId) return undefined;
    return records.find((r) => String(r.deed_item_id) === String(currentDeedId));
  }, [records, currentDeedId]);

  const seriesData: LineChartSeries[] = useMemo(() => {
    if (!hasDeeds || !currentRecord) return [];

    const end = endDate ? dayjs(endDate).startOf('day') : dayjs().startOf('day');
    const start = startDate ? dayjs(startDate).startOf('day') : dayjs().subtract(30, 'day').startOf('day');
    
    let curr = start;
    const days: dayjs.Dayjs[] = [];
    while (!curr.isAfter(end)) {
      days.push(curr);
      curr = curr.add(1, 'day');
    }

    const buildPoints = (dailyCounts?: Array<{ date: string; count: number }> | null): [number, number][] => {
      const countMap = new Map<string, number>();
      if (dailyCounts && Array.isArray(dailyCounts)) {
        dailyCounts.forEach((dc) => {
          if (dc.date) {
            const formatted = dayjs(dc.date).format('YYYY-MM-DD');
            countMap.set(formatted, (countMap.get(formatted) || 0) + Number(dc.count || 0));
          }
        });
      }

      return days.map((d) => {
        const key = d.format('YYYY-MM-DD');
        return [d.valueOf(), countMap.get(key) || 0];
      });
    };

    if (hasSubDeeds && currentDeed?.children && currentDeed.children.length > 0) {
      const activeChildren = currentDeed.children.filter((sub) => {
        const subId = String(sub.deed_item_id || sub.name);
        const byId = checkedSubDeeds?.[subId];
        const byName = sub.name ? checkedSubDeeds?.[sub.name] : undefined;
        if (byId !== undefined) return byId;
        if (byName !== undefined) return byName;
        return true;
      });

      const colors = getLineColors(mode, activeChildren.length);

      return activeChildren.map((child, index) => {
        const recordChild = currentRecord.children?.find(
          (c) => String(c.deed_item_id) === String(child.deed_item_id)
        );
        const data = buildPoints(recordChild?.daily_counts);
        return {
          id: String(child.deed_item_id || child.name),
          name: child.name,
          data,
          color: colors[index % colors.length],
          visible: !hiddenSeries[child.name]
        };
      });
    }

    const colors = getLineColors(mode, 1);
    const data = buildPoints(currentRecord.daily_counts);
    return [
      {
        id: String(currentDeed?.deed_item_id || 'deed'),
        name: currentDeed?.name || 'Count',
        data,
        color: colors[0],
        visible: !hiddenSeries[currentDeed?.name || 'Count']
      }
    ];
  }, [hasDeeds, currentRecord, startDate, endDate, hasSubDeeds, currentDeed, checkedSubDeeds, mode, hiddenSeries]);

  const hasRecords = useMemo(() => {
    return seriesData.some((series) => series.data.some((point) => point[1] > 0));
  }, [seriesData]);

  const handleToggleSeries = (name: string) => setHiddenSeries((prev) => ({ ...prev, [name]: !prev[name] }));

  const chartOptions = useMemo(() => {
    return getDefaultLineChartOptions(mode, seriesData, isMobile, handleToggleSeries);
  }, [mode, seriesData, isMobile]);

  useEffect(() => {
    let isMounted = true;
    loadHighcharts()
      .then(() => {
        if (isMounted) setIsHighchartsLoading(false);
      })
      .catch((err) => {
        console.error(PLACEHOLDERS.FAILED_TO_LOAD_HIGHCHARTS, err);
        if (isMounted) setIsHighchartsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, [currentDeedId]);

  useEffect(() => {
    let isMounted = true;

    if (!hasDeeds || !hasRecords || isHighchartsLoading || isWaitingForInitialDeed || isWaitingForRecords || activeErrorMessage) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    loadHighcharts()
      .then((Highcharts) => {
        if (!isMounted || !containerRef.current) return;

        if (!chartRef.current) {
          chartRef.current = Highcharts.chart(containerRef.current, chartOptions);
        } else {
          chartRef.current.update(chartOptions, true, true);
        }
      })
      .catch((err) => {
        console.error(PLACEHOLDERS.FAILED_TO_LOAD_HIGHCHARTS, err);
      });

    return () => {
      isMounted = false;
    };
  }, [chartOptions, hasDeeds, hasRecords, isHighchartsLoading, isWaitingForInitialDeed, isWaitingForRecords, activeErrorMessage]);

  useEffect(() => {
    if (!showSkeleton && !activeErrorMessage && chartRef.current) chartRef.current.reflow();
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

  const showLegend = seriesData.length > 1;

  return (
    <div className={styles.container}>
      {showSkeleton && (
        <div className={styles.skeleton__container}>
          <div className={styles.skeleton__line__wrapper}>
            <Skeleton width="100%" height="80%" borderRadius={8} />
          </div>
          {hasSubDeeds && (
            <div className={styles.skeleton__legend}>
              <Skeleton width={60} height={12} borderRadius={4} />
              <Skeleton width={75} height={12} borderRadius={4} />
              <Skeleton width={55} height={12} borderRadius={4} />
            </div>
          )}
        </div>
      )}

      {!showSkeleton && !isDeedsPending && !hasDeeds && (
        <div className={styles.error__container}>
          <FiAlertCircle className={styles.error__icon} />
          <h4 className={styles.error__title}>{PLACEHOLDERS.NO_DEEDS_TITLE}</h4>
          <p className={styles.error__description}>{PLACEHOLDERS.STEPPER_NO_DEEDS}</p>
        </div>
      )}

      {!showSkeleton && hasDeeds && activeErrorMessage && (
        <div className={styles.error__container}>
          <FiAlertCircle className={styles.error__icon} />
          <h4 className={styles.error__title}>{PLACEHOLDERS.SELECTION_REQUIRED}</h4>
          <p className={styles.error__description}>{activeErrorMessage}</p>
        </div>
      )}

      {!showSkeleton && hasDeeds && !isRecordsPending && !hasRecords && !activeErrorMessage && (
        <div className={styles.error__container}>
          <FiAlertCircle className={styles.error__icon} />
          <h4 className={styles.error__title}>{PLACEHOLDERS.NO_RECORDS_TITLE}</h4>
          <p className={styles.error__description}>{PLACEHOLDERS.NO_RECORDS_DESCRIPTION}</p>
        </div>
      )}

      <div
        className={clsx(styles.content, {
          [styles.hidden]: Boolean(showSkeleton || activeErrorMessage || !hasDeeds || !hasRecords)
        })}
      >
        <div className={styles.chart__area}>
          <div ref={containerRef} className={styles.chart} />
        </div>

        {showLegend && (
          <div className={styles.legend}>
            {seriesData.map((s) => {
              const isVisible = s.visible !== false;
              return (
                <button
                  key={s.name}
                  type="button"
                  className={clsx(styles.legend__item, {
                    [styles.hidden]: !isVisible
                  })}
                  onClick={() => handleToggleSeries(s.name)}
                >
                  <span
                    className={styles.legend__symbol}
                    style={{ backgroundColor: s.color }}
                  />
                  <span className={styles.legend__label}>{s.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};