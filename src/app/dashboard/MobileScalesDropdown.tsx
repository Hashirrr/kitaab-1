'use client';

import clsx from 'clsx';
import { isChecked } from './utils';
import styles from './styles.module.css';
import { FaChevronDown } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';
import Checkbox from '@/components/primitive/checkbox';
import { PLACEHOLDERS } from '@/constants/placeholders';
import type { MobileScalesDropdownProps } from './interface';
import Skeleton from '@/components/primitive/skeleton/Skeleton';

export default function MobileScalesDropdown({ scales, checkedScales, isPending, onToggleScale }: MobileScalesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasScales = scales.length > 0;
  const selectedCount = scales.filter((scale) => isChecked(checkedScales, scale)).length;
  const triggerLabel = !hasScales ? PLACEHOLDERS.NO_SCALES_FOUND : selectedCount === scales.length ? 'All Scales' : `Scales (${selectedCount}/${scales.length})`;

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  if (isPending && scales.length === 0) {
    return (
      <div className={styles.mobile__dropdown__wrapper}>
        <Skeleton height={40} width="100%" borderRadius={5} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.mobile__dropdown__wrapper}>
      <button
        type="button"
        disabled={!hasScales}
        className={clsx(styles.mobile__dropdown__trigger, {
          [styles.open]: isOpen,
          [styles.disabled]: !hasScales
        })}
        onClick={() => hasScales && setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.mobile__dropdown__label}>{triggerLabel}</span>
        {hasScales && (
          <span
            className={clsx(styles.mobile__dropdown__chevron, {
              [styles.open]: isOpen
            })}
          >
            <FaChevronDown size={11} />
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.mobile__dropdown__menu}>
          {scales.map((scale) => (
            <div key={scale} className={styles.mobile__dropdown__checkbox__row}>
              <Checkbox
                label={scale}
                checked={isChecked(checkedScales, scale)}
                onChange={() => onToggleScale(scale)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
