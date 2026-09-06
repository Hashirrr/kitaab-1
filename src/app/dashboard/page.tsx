'use client';

import clsx from 'clsx';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import Chart from '@/components/composite/chart';
import Radio from '@/components/primitive/radio';
import { useGetDeeds } from '@/hooks/deeds/hook';
import Dropdown from '@/components/primitive/dropdown';
import Checkbox from '@/components/primitive/checkbox';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { TIME_RANGE_OPTIONS, isChecked, toggleChecked } from './utils';
import { DEFAULT_SCALE_COUNTS } from '@/components/composite/chart/utils';

export default function Dashboard() {

  const scales = Object.keys(DEFAULT_SCALE_COUNTS);
  const [selectedDeedId, setSelectedDeedId] = useState<string>('');
  const { CARD_HEADING_DEEDS, CARD_HEADING_SCALES } = PLACEHOLDERS;
  const [timeRange, setTimeRange] = useState<string>('last_30_days');
  const { data: deeds = [], isPending: isDeedsPending } = useGetDeeds();
  const [checkedScales, setCheckedScales] = useState<Record<string, boolean>>({});
  const [checkedSubDeeds, setCheckedSubDeeds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedDeedId && deeds.length > 0) {
      setSelectedDeedId(deeds[0].deed_item_id || deeds[0].deed_id || '');
    }
  }, [deeds, selectedDeedId]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Chart
          checkedScales={checkedScales}
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
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className={styles.deed__group}>
                    <Radio skeleton />
                  </div>
                ))
              : deeds.map((deed) => {
                  const deedId = deed.deed_item_id || deed.deed_id;
                  const isSelected = selectedDeedId === deedId;
                  const hasChildren = Boolean(deed.children && deed.children.length > 0);

                  return (
                    <div key={deedId} className={styles.deed__group}>
                      <Radio
                        name="selected_deed"
                        label={deed.name}
                        checked={isSelected}
                        onChange={() => setSelectedDeedId(deedId)}
                      />
                      {hasChildren && (
                        <div
                          className={clsx(styles.subdeeds__wrapper, {
                            [styles.open]: isSelected
                          })}
                        >
                          <div className={styles.subdeeds__inner}>
                            {deed.children!.map((subDeed) => {
                              const subDeedId = subDeed.deed_item_id || subDeed.name;
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
            {scales.map((scale) => (
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