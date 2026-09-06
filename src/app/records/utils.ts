import dayjs from 'dayjs';
import { DeedTypes } from '@/constants/enums';
import { DeedItem } from '@/hooks/deeds/interface';
import { ScaleItem } from '@/hooks/scales/interface';
import { RecordPayload, RecordResponse } from '@/hooks/records/interface';
import { NOT_SELECTED, DeedRecordItem, HandleUpdateCountProps, HandleUpdateOptionProps, HandleUpdateSubDeedCountProps, HandleUpdateSubDeedOptionProps } from './interface';

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

    const parentType = deed.type ? (String(deed.type).toLowerCase() === 'count' ? DeedTypes.count : DeedTypes.scale): DeedTypes.scale;

    return {
      name: deed.name,
      type: parentType,
      id: deed.deed_item_id,
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

          const childRawType = child.type || deed.type;
          const childType = childRawType ? (String(childRawType).toLowerCase() === 'count' ? DeedTypes.count : DeedTypes.scale): DeedTypes.scale;

          return {
            type: childType,
            name: child.name,
            id: child.deed_item_id,
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

export const getLatestDate = (deeds?: DeedItem[]): string => {
  const recordedDates: dayjs.Dayjs[] = [];

  const extractRecordedDate = (item: DeedItem) => {
    const rawDate = item.last_recorded_at || (item as unknown as { last_recorded?: string }).last_recorded;
    if (rawDate && dayjs(rawDate).isValid()) {
      recordedDates.push(dayjs(rawDate));
    }
    if (item.children?.length) {
      item.children.forEach(extractRecordedDate);
    }
  };

  deeds?.forEach(extractRecordedDate);

  if (recordedDates.length > 0) {
    const maxDate = recordedDates.reduce((max, curr) => (curr.isAfter(max) ? curr : max));
    return maxDate.add(1, 'day').format('YYYY-MM-DD');
  }

  return dayjs().add(1, 'day').format('YYYY-MM-DD');
};