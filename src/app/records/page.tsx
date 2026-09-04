'use client';

import { useState } from 'react';
import RecordCards from './RecordCards';
import { getLatestDate } from './utils';
import { useGetDeeds } from '@/hooks/deeds/hook';
import Calendar from '@/components/composite/calendar/Calendar';

export default function Records() {
  const { data: deeds } = useGetDeeds();
  const latestRecordedDate = getLatestDate(deeds);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        latestRecordedDate={latestRecordedDate}
      />
      <RecordCards
        selectedDate={selectedDate}
        latestRecordedDate={latestRecordedDate}
      />
    </>
  );
};