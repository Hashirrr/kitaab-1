import dayjs from 'dayjs';
import { DeedTypes } from '@/constants/enums';
import { DeedItem } from '@/hooks/deeds/interface';
import { ScaleItem } from '@/hooks/scales/interface';
import { RecordPayload, RecordResponse, RecordsRangeResponse, DeedRangeItem, DeedRangeChild } from '@/hooks/records/interface';
import { NOT_SELECTED, DeedRecordItem, HandleUpdateCountProps, HandleUpdateOptionProps, HandleUpdateSubDeedCountProps, HandleUpdateSubDeedOptionProps, HandleSaveSuccessProps, HandleDateChangeProps, HandleSaveProps } from './interface';

export const getScaleItemId = (optionName: string, scales?: ScaleItem[]): string | null => {
  if (optionName === NOT_SELECTED) return null;
  return scales?.find((s) => s.name === optionName)?.scale_items_id ?? null;
};

export const formatCountValue = (val: unknown): number | null => {
  if (val === null || val === undefined || val === '') return null;
  const num = typeof val === 'number' ? val : Number(val);
  return isNaN(num) ? null : Math.round(num);
};

export const getRecordDeeds = (deedsData?: DeedItem[], scalesData?: ScaleItem[], recordsData?: RecordResponse[], targetDate?: Date): DeedRecordItem[] => {
  if (!deedsData || !deedsData.length) return [];

  const filteredDeeds = targetDate
    ? deedsData.filter((deed) => {
      if (deed.created_at && dayjs(deed.created_at).isValid()) {
        const isDeedCreated = !dayjs(targetDate).startOf('day').isBefore(dayjs(deed.created_at).startOf('day'));
        if (!isDeedCreated) return false;
      }

      if (deed.children && deed.children.length > 0) {
        const hasValidChild = deed.children.some((child) => {
          if (!child.created_at || !dayjs(child.created_at).isValid()) return true;
          return !dayjs(targetDate).startOf('day').isBefore(dayjs(child.created_at).startOf('day'));
        });
        if (!hasValidChild) return false;
      }

      return true;
    })
    : deedsData;

  if (!filteredDeeds.length) return [];

  const scaleOptions = scalesData?.length
    ? [...scalesData.map((s) => s.name), NOT_SELECTED]
    : undefined;

  return filteredDeeds.map((deed) => {
    const hasChildren = Boolean(deed.children && deed.children.length > 0);
    const validChildren = hasChildren
      ? (targetDate
        ? deed.children!.filter((child) => {
          if (!child.created_at || !dayjs(child.created_at).isValid()) return true;
          return !dayjs(targetDate).startOf('day').isBefore(dayjs(child.created_at).startOf('day'));
        })
        : deed.children!)
      : undefined;

    const parentRecord = recordsData?.find(
      (r) => String(r.deed_item_id) === String(deed.deed_item_id)
    );

    const parentCount = formatCountValue(parentRecord?.count_value);

    let parentOption = NOT_SELECTED;
    if (parentRecord?.scale_item_id && scalesData?.length) {
      const matchingScale = scalesData.find(
        (s) => String(s.scale_items_id) === String(parentRecord.scale_item_id)
      );
      if (matchingScale) parentOption = matchingScale.name;
    }

    return {
      id: deed.deed_item_id,
      name: deed.name,
      type: DeedTypes.scale,
      options: scaleOptions,
      selectedOption: hasChildren ? undefined : parentOption,
      countValue: parentCount,
      scale_item_id: parentRecord?.scale_item_id ? String(parentRecord.scale_item_id) : null,
      children: validChildren && validChildren.length > 0
        ? validChildren.map((child) => {
          const childRecord = recordsData?.find(
            (r) => String(r.deed_item_id) === String(child.deed_item_id)
          );

          const childCount = formatCountValue(childRecord?.count_value);

          let childOption = NOT_SELECTED;
          if (childRecord?.scale_item_id && scalesData?.length) {
            const matchingScale = scalesData.find(
              (s) => String(s.scale_items_id) === String(childRecord.scale_item_id)
            );
            if (matchingScale) childOption = matchingScale.name;
          }

          return {
            id: child.deed_item_id,
            name: child.name,
            type: DeedTypes.scale,
            options: scaleOptions,
            selectedOption: childOption,
            countValue: childCount,
            scale_item_id: childRecord?.scale_item_id ? String(childRecord.scale_item_id) : null
          };
        })
        : undefined
    };
  });
};

export const buildRecordsPayload = (deeds: DeedRecordItem[], date: string): RecordPayload[] => {
  const records: RecordPayload[] = [];

  const processItem = (item: DeedRecordItem) => {
    if (item.selectedOption && item.selectedOption !== NOT_SELECTED) {
      records.push({
        deed_item_id: item.id,
        date,
        ...(item.scale_item_id ? { scale_item_id: item.scale_item_id } : {})
      });
    }

    if (item.countValue !== null && item.countValue !== undefined) {
      const formattedCount = formatCountValue(item.countValue);
      if (formattedCount !== null) {
        records.push({
          deed_item_id: item.id,
          date,
          count_value: formattedCount
        });
      }
    }
  };

  deeds.forEach((deed) => {
    if (deed.children?.length) {
      deed.children.forEach((sub) => processItem(sub));
    } else {
      processItem(deed);
    }
  });

  return records;
};

export const handleUpdateSubDeedOption = ({ setDeeds, deedId, subDeedId, option, scaleItemId }: HandleUpdateSubDeedOptionProps) => {
  setDeeds((prev) =>
    prev.map((deed) => {
      if (deed.id !== deedId) return deed;
      return {
        ...deed,
        children: deed.children?.map((sub) =>
          sub.id === subDeedId ? { ...sub, selectedOption: option, scale_item_id: scaleItemId ?? null } : sub
        )
      };
    })
  );
};

export const handleUpdateSubDeedCount = ({ setDeeds, deedId, subDeedId, count }: HandleUpdateSubDeedCountProps) => {
  const formattedCount = formatCountValue(count);
  setDeeds((prev) =>
    prev.map((deed) => {
      if (deed.id !== deedId) return deed;
      return {
        ...deed,
        children: deed.children?.map((sub) =>
          sub.id === subDeedId ? { ...sub, countValue: formattedCount } : sub
        )
      };
    })
  );
};

export const handleUpdateOption = ({ setDeeds, deedId, option, scaleItemId }: HandleUpdateOptionProps) => {
  setDeeds((prev) =>
    prev.map((deed) => (deed.id === deedId ? { ...deed, selectedOption: option, scale_item_id: scaleItemId ?? null } : deed))
  );
};

export const handleUpdateCount = ({ setDeeds, deedId, count }: HandleUpdateCountProps) => {
  const formattedCount = formatCountValue(count);
  setDeeds((prev) =>
    prev.map((deed) => (deed.id === deedId ? { ...deed, countValue: formattedCount } : deed))
  );
};

export const isSaveRecordsDisabled = (deeds: DeedRecordItem[]) => {
  return deeds.every((deed) => {
    const hasParentOption = Boolean(deed.selectedOption && deed.selectedOption !== NOT_SELECTED);
    const hasParentCount = deed.countValue !== null && deed.countValue !== undefined;
    const hasChildrenRecorded = deed.children?.some((child) => {
      const hasChildOption = Boolean(child.selectedOption && child.selectedOption !== NOT_SELECTED);
      const hasChildCount = child.countValue !== null && child.countValue !== undefined;
      return hasChildOption || hasChildCount;
    });

    return !hasParentOption && !hasParentCount && !hasChildrenRecorded;
  });
};

export const getLatestDate = (deeds?: DeedItem[], recordsRange?: RecordsRangeResponse): string => {
  if (!deeds || !deeds.length) {
    return dayjs().format('YYYY-MM-DD');
  }

  const rangeMap = new Map<string, number>();
  if (recordsRange && recordsRange.length > 0) {
    const mapItem = (item: DeedRangeItem | DeedRangeChild) => {
      const id = String(item.deed_item_id);
      const count = item.daily_counts ? item.daily_counts.length : (item.total || 0);
      rangeMap.set(id, count);
      if ('children' in item && item.children) {
        item.children.forEach(mapItem);
      }
    };
    recordsRange.forEach(mapItem);
  }

  const nextDates: dayjs.Dayjs[] = [];

  const processDeed = (item: DeedItem, parentCreatedAt?: string) => {
    const effectiveCreatedAt = item.created_at || parentCreatedAt;

    if (item.children && item.children.length > 0) {
      item.children.forEach(child => processDeed(child, effectiveCreatedAt));
      return;
    }

    const itemId = String(item.deed_item_id);
    if (rangeMap.has(itemId) && effectiveCreatedAt && dayjs(effectiveCreatedAt).isValid()) {
      const daysRecorded = rangeMap.get(itemId)!;
      nextDates.push(dayjs(effectiveCreatedAt).startOf('day').add(daysRecorded, 'day'));
      return;
    }

    if (effectiveCreatedAt && dayjs(effectiveCreatedAt).isValid()) {
      nextDates.push(dayjs(effectiveCreatedAt).startOf('day'));
    }
  };

  deeds.forEach(deed => processDeed(deed));

  if (nextDates.length > 0) {
    const minNextDate = nextDates.reduce((min, curr) => (curr.isBefore(min) ? curr : min));
    return minNextDate.format('YYYY-MM-DD');
  }

  return dayjs().format('YYYY-MM-DD');
};

export const handleSaveSuccess = ({ savedDate, setSelectedDate }: HandleSaveSuccessProps) => {
  const nextDate = dayjs(savedDate).add(1, 'day');
  const isNextFuture = nextDate.startOf('day').isAfter(dayjs().startOf('day'));
  if (!isNextFuture) {
    setSelectedDate(nextDate.toDate());
  }
};

export const handleDateChange = ({ date, setSelectedDate, isInitializedRef }: HandleDateChangeProps) => {
  isInitializedRef.current = true;
  setSelectedDate(date);
};

export const handleSave = async ({ deeds, formattedDate, selectedDate, createRecords, onSaveSuccess }: HandleSaveProps) => {
  if (!selectedDate || !formattedDate) return;
  const recordsPayload = buildRecordsPayload(deeds, formattedDate);
  if (!recordsPayload.length) return;
  await createRecords({ records: recordsPayload });
  onSaveSuccess?.(selectedDate);
};