'use client';

import clsx from 'clsx';
import { getScaleItemId } from './utils';
import styles from './recordcards.module.css';
import { useGetScales } from '@/hooks/scales/hook';
import { NOT_SELECTED, RecordCardProps } from './interface';
import Skeleton from '@/components/primitive/skeleton/Skeleton';
import { FaMinus, FaPlus, FaRotateLeft } from 'react-icons/fa6';
import { DeedTypes, HTMLAttributeType } from '@/constants/enums';

export default function RecordCard({ deed, onUpdateCount, onUpdateOption, onUpdateSubDeedCount, onUpdateSubDeedOption }: RecordCardProps) {
  const { id, name, type, children, options, selectedOption, countValue, scale_item_id } = deed;
  const { data: getScales, isPending: isScalesPending } = useGetScales(id);

  const dynamicScaleOptions = getScales?.length
    ? [...getScales.map((s) => s.name), NOT_SELECTED]
    : (options?.length ? [...options, NOT_SELECTED] : []);

  if (Boolean(children?.length)) {
    return (
      <div className={styles.card}>
        <div className={styles.card__header}>
          <h3 className={styles.title}>{name}</h3>
          <hr className={styles.fading__line} />
        </div>

        <div className={styles.subdeeds__list}>
          {children!.map((subDeed) => {
            const currentOptions = subDeed.options || dynamicScaleOptions;
            const matchingScale = getScales?.find(
              (s) => String(s.scale_items_id) === String(subDeed.scale_item_id)
            );
            const activeOption = subDeed.selectedOption && subDeed.selectedOption !== NOT_SELECTED
              ? subDeed.selectedOption
              : matchingScale?.name || subDeed.selectedOption || NOT_SELECTED;

            const isSubDeedCount = subDeed.type === DeedTypes.count || (!isScalesPending && !getScales?.length && !subDeed.options?.length);

            return (
              <div key={subDeed.id} className={styles.subdeed__row}>
                <span className={styles.subdeed__name}>{subDeed.name}</span>

                {isScalesPending ? (
                  <div className={styles.mcq__group}>
                    <Skeleton height={34} width={102} borderRadius={6} />
                    <Skeleton height={34} width={102} borderRadius={6} />
                    <Skeleton height={34} width={102} borderRadius={6} />
                  </div>
                ) : !isSubDeedCount ? (
                  <div className={styles.mcq__group}>
                    {currentOptions.map((option) => (
                      <button
                        key={option}
                        type={HTMLAttributeType.button}
                        onClick={() => onUpdateSubDeedOption?.(id, subDeed.id, option, getScaleItemId(option, getScales))}
                        className={clsx(styles.mcq__btn, {
                          [styles.selected]: activeOption === option
                        })}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.count__wrapper}>
                    <div className={styles.count__controls}>
                      <button
                        aria-label='Decrease count'
                        type={HTMLAttributeType.button}
                        className={styles.stepper__btn}
                        onClick={() => {
                          const current = subDeed.countValue != null ? Math.round(Number(subDeed.countValue)) : 0;
                          onUpdateSubDeedCount?.(id, subDeed.id, Math.max(0, current - 1));
                        }}
                      >
                        <FaMinus size={11} />
                      </button>

                      <input
                        placeholder='—'
                        pattern='[0-9]*'
                        inputMode='numeric'
                        type={HTMLAttributeType.text}
                        className={styles.count__input}
                        value={subDeed.countValue === null || subDeed.countValue === undefined ? '' : Math.round(Number(subDeed.countValue))}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\D/g, '');
                          onUpdateSubDeedCount?.(id, subDeed.id, cleaned === '' ? null : parseInt(cleaned, 10));
                        }}
                      />

                      <button
                        aria-label='Increase count'
                        className={styles.stepper__btn}
                        type={HTMLAttributeType.button}
                        onClick={() => {
                          const current = subDeed.countValue != null ? Math.round(Number(subDeed.countValue)) : 0;
                          onUpdateSubDeedCount?.(id, subDeed.id, current + 1);
                        }}
                      >
                        <FaPlus size={11} />
                      </button>

                      <button
                        aria-label='Reset count'
                        type={HTMLAttributeType.button}
                        className={styles.stepper__btn}
                        onClick={() => onUpdateSubDeedCount?.(id, subDeed.id, null)}
                      >
                        <FaRotateLeft size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentOptions = options || dynamicScaleOptions;
  const parentMatchingScale = getScales?.find(
    (s) => String(s.scale_items_id) === String(scale_item_id)
  );
  const activeParentOption = selectedOption && selectedOption !== NOT_SELECTED
    ? selectedOption
    : parentMatchingScale?.name || selectedOption || NOT_SELECTED;

  const isCountType = type === DeedTypes.count || (!isScalesPending && !getScales?.length && !options?.length);

  return (
    <div className={styles.card}>
      <div className={styles.single__deed__row}>
        <span className={styles.single__deed__name}>{name}</span>

        {isScalesPending ? (
          <div className={styles.mcq__group}>
            <Skeleton height={34} width={102} borderRadius={6} />
            <Skeleton height={34} width={102} borderRadius={6} />
            <Skeleton height={34} width={102} borderRadius={6} />
          </div>
        ) : !isCountType ? (
          <div className={styles.mcq__group}>
            {currentOptions.map((option) => (
              <button
                key={option}
                type={HTMLAttributeType.button}
                onClick={() => onUpdateOption?.(id, option, getScaleItemId(option, getScales))}
                className={clsx(styles.mcq__btn, {
                  [styles.selected]: activeParentOption === option
                })}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.count__wrapper}>
            <div className={styles.count__controls}>
              <button
                aria-label='Decrease count'
                type={HTMLAttributeType.button}
                className={styles.stepper__btn}
                onClick={() => {
                  const current = countValue != null ? Math.round(Number(countValue)) : 0;
                  onUpdateCount?.(id, Math.max(0, current - 1));
                }}
              >
                <FaMinus size={11} />
              </button>

              <input
                placeholder='—'
                pattern='[0-9]*'
                inputMode='numeric'
                type={HTMLAttributeType.text}
                className={styles.count__input}
                value={countValue === null || countValue === undefined ? '' : Math.round(Number(countValue))}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  onUpdateCount?.(id, cleaned === '' ? null : parseInt(cleaned, 10));
                }}
              />

              <button
                aria-label='Increase count'
                type={HTMLAttributeType.button}
                className={styles.stepper__btn}
                onClick={() => {
                  const current = countValue != null ? Math.round(Number(countValue)) : 0;
                  onUpdateCount?.(id, current + 1);
                }}
              >
                <FaPlus size={11} />
              </button>

              <button
                aria-label='Reset count'
                type={HTMLAttributeType.button}
                className={styles.stepper__btn}
                onClick={() => onUpdateCount?.(id, null)}
              >
                <FaRotateLeft size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};