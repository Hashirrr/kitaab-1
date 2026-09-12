'use client';

import dayjs from 'dayjs';
import RecordCards from './RecordCards';
import { getLatestDate, handleDateChange, handleSaveSuccess } from './utils';
import { DeedItem } from '@/hooks/deeds/interface';
import { useGetDeeds } from '@/hooks/deeds/hook';
import { useGetRecordsRange } from '@/hooks/records/hook';
import { useEffect, useMemo, useRef, useState } from 'react';
import Calendar from '@/components/composite/calendar/Calendar';

export default function Records() {
  const { data: deeds, isPending: isDeedsPending } = useGetDeeds();

  const startDate = useMemo(() => {
    if (!deeds) return undefined;
    if (!deeds.length) return dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    const dates: dayjs.Dayjs[] = [];
    const collectDates = (item: DeedItem) => {
      if (item.created_at && dayjs(item.created_at).isValid()) {
        dates.push(dayjs(item.created_at));
      }
      item.children?.forEach(collectDates);
    };
    deeds.forEach(collectDates);
    if (!dates.length) return dayjs().subtract(1, 'month').format('YYYY-MM-DD');
    const minCreated = dates.reduce((min, curr) => (curr.isBefore(min) ? curr : min));
    return minCreated.format('YYYY-MM-DD');
  }, [deeds]);

  const endDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  const { data: recordsRange, isPending: isRecordsRangePending } = useGetRecordsRange(startDate, endDate);

  const isInitialLoading = isDeedsPending || Boolean(deeds && deeds.length > 0 && isRecordsRangePending && !recordsRange);

  const latestRecordedDate = useMemo(() => {
    if (isInitialLoading) return undefined;
    return getLatestDate(deeds, recordsRange);
  }, [deeds, recordsRange, isInitialLoading]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitialLoading && latestRecordedDate && !isInitializedRef.current) {
      isInitializedRef.current = true;
      setSelectedDate(dayjs(latestRecordedDate).toDate());
    }
  }, [latestRecordedDate, isInitialLoading]);

  return (
    <>
      <Calendar
        value={selectedDate}
        onChange={(date) => handleDateChange({ date, setSelectedDate, isInitializedRef })}
        latestRecordedDate={latestRecordedDate}
      />
      <RecordCards
        selectedDate={selectedDate}
        latestRecordedDate={latestRecordedDate}
        onSaveSuccess={(savedDate) => handleSaveSuccess({ savedDate, setSelectedDate })}
      />
    </>
  );
};