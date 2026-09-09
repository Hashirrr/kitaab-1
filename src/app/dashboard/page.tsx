'use client';

import clsx from 'clsx';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import Chart from '@/components/composite/chart';
import Radio from '@/components/primitive/radio';
import { useGetDeeds } from '@/hooks/deeds/hook';
import { useGetScales } from '@/hooks/scales/hook';
import Dropdown from '@/components/primitive/dropdown';
import Checkbox from '@/components/primitive/checkbox';
import { PLACEHOLDERS } from '@/constants/placeholders';
import MobileDeedsDropdown from './MobileDeedsDropdown';
import MobileScalesDropdown from './MobileScalesDropdown';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentDeedId } from '@/store/slices/selectors';
import { setCurrentDeedId, setDateRange } from '@/store/slices/uiSlice';
import { DEFAULT_SCALE_COUNTS } from '@/components/composite/chart/utils';
import { getDateRangeFromTimeRange, TIME_RANGE_OPTIONS, isChecked, toggleChecked } from './utils';

const SKELETON_DEED_WIDTHS = [65, 48, 76, 54];
const SKELETON_SCALE_WIDTHS = [78, 58, 42, 68];

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const currentDeedId = useAppSelector(selectCurrentDeedId);
  const { CARD_HEADING_DEEDS, CARD_HEADING_SCALES } = PLACEHOLDERS;
  const [timeRange, setTimeRange] = useState<string>('last_30_days');
  const { data: deeds = [], isPending: isDeedsPending } = useGetDeeds();
  const [checkedScales, setCheckedScales] = useState<Record<string, boolean>>({});
  const [checkedSubDeeds, setCheckedSubDeeds] = useState<Record<string, boolean>>({});
  const { data: scalesData = [], isPending: isScalesPending } = useGetScales(currentDeedId);
  const scales = scalesData.length > 0 ? scalesData.map((scale) => scale.name) : Object.keys(DEFAULT_SCALE_COUNTS);

  useEffect(() => {
    const { startDate, endDate } = getDateRangeFromTimeRange(timeRange);
    dispatch(setDateRange({ startDate, endDate }));
  }, [dispatch, timeRange]);

  useEffect(() => {
    if (!currentDeedId && deeds.length > 0) {
      dispatch(setCurrentDeedId(deeds[0].deed_item_id));
    }
  }, [deeds, currentDeedId, dispatch]);

  useEffect(() => {
    setCheckedScales({});
  }, [currentDeedId]);

  return (
    <div className={styles.container}>
      <div className={styles.mobile__controls}>
        <div className={styles.mobile__dropdowns__row}>
          <MobileDeedsDropdown
            deeds={deeds}
            currentDeedId={currentDeedId}
            checkedSubDeeds={checkedSubDeeds}
            isPending={isDeedsPending}
            onSelectDeed={(deedId) => dispatch(setCurrentDeedId(deedId))}
            onToggleSubDeed={(subDeedId) =>
              setCheckedSubDeeds((prev) => toggleChecked(prev, subDeedId))
            }
          />
          <MobileScalesDropdown
            scales={scales}
            checkedScales={checkedScales}
            isPending={isScalesPending}
            onToggleScale={(scale) =>
              setCheckedScales((prev) => toggleChecked(prev, scale))
            }
          />
        </div>
        <Dropdown
          value={timeRange}
          options={TIME_RANGE_OPTIONS}
          onChange={setTimeRange}
        />
      </div>
      <div className={styles.card}>
        <Chart
          checkedScales={checkedScales}
          checkedSubDeeds={checkedSubDeeds}
          onToggleScale={(scale, isVal) =>
            setCheckedScales((prev) => toggleChecked(prev, scale, isVal))
          }
        />
      </div>
      <div className={styles.side__column}>
        <Dropdown
          value={timeRange}
          options={TIME_RANGE_OPTIONS}
          onChange={setTimeRange}
        />
        <div className={styles.side__card}>
          <div className={styles.card__header}>
            <h3 className={styles.title}>{CARD_HEADING_DEEDS}</h3>
            <hr className={styles.fading__line} />
          </div>
          <div className={styles.deeds__list}>
            {isDeedsPending && deeds.length === 0
              ? SKELETON_DEED_WIDTHS.map((width, index) => (
                  <div key={index} className={styles.deed__group}>
                    <Radio skeleton skeletonWidth={width} />
                  </div>
                ))
              : deeds.map((deed) => {
                  const deedId = deed.deed_item_id;
                  const isSelected = String(currentDeedId) === String(deedId);
                  const hasChildren = Boolean(deed.children && deed.children.length > 0);

                  return (
                    <div key={deedId} className={styles.deed__group}>
                      <Radio
                        name="selected_deed"
                        label={deed.name}
                        checked={isSelected}
                        onChange={() => dispatch(setCurrentDeedId(deedId))}
                      />
                      {hasChildren && (
                        <div
                          className={clsx(styles.subdeeds__wrapper, {
                            [styles.open]: isSelected
                          })}
                        >
                          <div className={styles.subdeeds__inner}>
                            {deed.children!.map((subDeed) => {
                              const subDeedId = String(subDeed.deed_item_id || subDeed.name);
                              return (
                                <Checkbox
                                  key={subDeedId}
                                  label={subDeed.name}
                                  checked={isChecked(checkedSubDeeds, subDeedId)}
                                  onChange={() =>
                                    setCheckedSubDeeds((prev) =>
                                      toggleChecked(prev, subDeedId)
                                    )
                                  }
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
        <div className={styles.side__card}>
          <div className={styles.card__header}>
            <h3 className={styles.title}>{CARD_HEADING_SCALES}</h3>
            <hr className={styles.fading__line} />
          </div>
          <div className={styles.scales__list}>
            {isScalesPending && scalesData.length === 0
              ? SKELETON_SCALE_WIDTHS.map((width, index) => (
                  <div key={index} className={styles.deed__group}>
                    <Checkbox skeleton skeletonWidth={width} />
                  </div>
                ))
              : scales.map((scale) => (
                  <Checkbox
                    key={scale}
                    label={scale}
                    checked={isChecked(checkedScales, scale)}
                    onChange={() =>
                      setCheckedScales((prev) => toggleChecked(prev, scale))
                    }
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};