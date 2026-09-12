'use client';

import dayjs from 'dayjs';
import RecordCard from './RecordCard';
import styles from './recordcards.module.css';
import { useGetDeeds } from '@/hooks/deeds/hook';
import { useEffect, useMemo, useState } from 'react';
import { HTMLAttributeType } from '@/constants/enums';
import RecordCardSkeleton from './RecordCardSkeleton';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { DeedRecordItem, RecordCardsProps } from './interface';
import { useCreateRecords, useGetRecords } from '@/hooks/records/hook';
import { getRecordDeeds, handleSave, handleUpdateCount, handleUpdateOption, handleUpdateSubDeedCount, handleUpdateSubDeedOption, isSaveRecordsDisabled } from './utils';

export default function RecordCards({ selectedDate, latestRecordedDate, onSaveSuccess }: RecordCardsProps) {
  const isFutureDate = Boolean(
    selectedDate && latestRecordedDate && dayjs(selectedDate).startOf('day').isAfter(dayjs(latestRecordedDate).startOf('day'))
  );

  const formattedDate = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '';

  const { data: getDeeds, isPending: isDeedsPending } = useGetDeeds();
  const { data: getRecords, isPending: isRecordsPending } = useGetRecords(formattedDate);
  const { mutateAsync: createRecords, isPending: isCreateRecordsPending } = useCreateRecords();

  const initialDeeds = useMemo(
    () => (selectedDate ? getRecordDeeds(getDeeds, undefined, getRecords, selectedDate) : []),
    [getDeeds, getRecords, selectedDate]
  );
  const [deeds, setDeeds] = useState<DeedRecordItem[]>(initialDeeds);

  useEffect(() => {
    if (selectedDate) {
      setDeeds(getRecordDeeds(getDeeds, undefined, getRecords, selectedDate));
    }
  }, [getDeeds, getRecords, selectedDate]);

  if (!selectedDate) {
    return <RecordCardSkeleton />;
  }

  if (isFutureDate) {
    return (
      <div className={styles.container}>
        <p className={styles.no__data}>{PLACEHOLDERS.RECORD_PREVIOUS_DAYS_REQUIRED}</p>
      </div>
    );
  }

  const isInitialLoading = isDeedsPending || (isRecordsPending && !getRecords);

  if (isInitialLoading) {
    return <RecordCardSkeleton />;
  }

  return (
    <div className={styles.container}>
      {deeds.length > 0 ? (
        <>
          <div className={styles.grid}>
            {deeds.map((deed) => (
              <RecordCard
                deed={deed}
                key={deed.id}
                onUpdateCount={(deedId, count) => handleUpdateCount({ setDeeds, deedId, count })}
                onUpdateOption={(deedId, option, scaleItemId) =>
                  handleUpdateOption({ setDeeds, deedId, option, scaleItemId })
                }
                onUpdateSubDeedCount={(deedId, subDeedId, count) =>
                  handleUpdateSubDeedCount({ setDeeds, deedId, subDeedId, count })
                }
                onUpdateSubDeedOption={(deedId, subDeedId, option, scaleItemId) =>
                  handleUpdateSubDeedOption({ setDeeds, deedId, subDeedId, option, scaleItemId })
                }
              />
            ))}
          </div>

          <div className={styles.submit__container}>
            <button
              className={styles.submit__btn}
              type={HTMLAttributeType.button}
              disabled={isSaveRecordsDisabled(deeds) || isCreateRecordsPending}
              onClick={() => handleSave({ deeds, formattedDate, selectedDate, createRecords, onSaveSuccess })}
            >
              {isCreateRecordsPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      ) : (
        <p className={styles.no__data}>{PLACEHOLDERS.NO_DEEDS_TO_SHOW}</p>
      )}
    </div>
  );
};