'use client';

import clsx from 'clsx';
import { isChecked } from './utils';
import styles from './styles.module.css';
import { FaChevronDown } from 'react-icons/fa6';
import Radio from '@/components/primitive/radio';
import { useEffect, useRef, useState } from 'react';
import Checkbox from '@/components/primitive/checkbox';
import type { MobileDeedsDropdownProps } from './interface';
import Skeleton from '@/components/primitive/skeleton/Skeleton';

export default function MobileDeedsDropdown({ deeds, currentDeedId, checkedSubDeeds, isPending, onSelectDeed, onToggleSubDeed }: MobileDeedsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDeed = deeds.find((d) => String(d.deed_item_id) === String(currentDeedId));
  const triggerLabel = currentDeed?.name || 'Deeds';

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

  if (isPending && deeds.length === 0) {
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
        className={clsx(styles.mobile__dropdown__trigger, {
          [styles.open]: isOpen
        })}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.mobile__dropdown__label}>{triggerLabel}</span>
        <span
          className={clsx(styles.mobile__dropdown__chevron, {
            [styles.open]: isOpen
          })}
        >
          <FaChevronDown size={11} />
        </span>
      </button>

      {isOpen && (
        <div className={styles.mobile__dropdown__menu}>
          {deeds.map((deed) => {
            const deedId = deed.deed_item_id;
            const isSelected = String(currentDeedId) === String(deedId);
            const hasChildren = Boolean(deed.children && deed.children.length > 0);

            return (
              <div key={deedId} className={styles.mobile__dropdown__item}>
                <Radio
                  name="mobile_selected_deed"
                  label={deed.name}
                  checked={isSelected}
                  onChange={() => {
                    onSelectDeed(deedId);
                    if (!hasChildren) {
                      setIsOpen(false);
                    }
                  }}
                />
                {hasChildren && isSelected && (
                  <div className={styles.mobile__dropdown__subdeeds}>
                    {deed.children!.map((subDeed) => {
                      const subDeedId = String(subDeed.deed_item_id || subDeed.name);
                      return (
                        <Checkbox
                          key={subDeedId}
                          label={subDeed.name}
                          checked={isChecked(checkedSubDeeds, subDeedId)}
                          onChange={() => onToggleSubDeed(subDeedId)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
