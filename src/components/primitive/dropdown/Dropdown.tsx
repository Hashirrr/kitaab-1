'use client';

import clsx from 'clsx';
import styles from './dropdown.module.css';
import Skeleton from '../skeleton/Skeleton';
import { FaChevronDown } from 'react-icons/fa6';
import { toSnakeCase } from '@/store/slices/utils';
import { HTMLAttributeType } from '@/constants/enums';
import { DropdownOption, DropdownProps } from './interface';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';

export default function Dropdown({ id, name, label, helper, required, disabled, skeleton, options, value, defaultValue, onChange, className, width }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(defaultValue || '');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const normalizedOptions: DropdownOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return opt;
    });
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === currentValue);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Adjust scroll when highlighted index changes
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && menuRef.current) {
      const items = menuRef.current.querySelectorAll(`.${styles.option}`);
      if (items[highlightedIndex]) {
        (items[highlightedIndex] as HTMLElement).scrollIntoView({
          block: 'nearest'
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled || disabled) return;
    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const currentIndex = normalizedOptions.findIndex((opt) => opt.value === currentValue);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev < normalizedOptions.length - 1 ? prev + 1 : 0;
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : normalizedOptions.length - 1;
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (highlightedIndex >= 0 && normalizedOptions[highlightedIndex]) {
        handleSelect(normalizedOptions[highlightedIndex]);
      }
    }
  };

  const inputId = id || (label ? toSnakeCase(label) : undefined);

  if (skeleton) {
    return (
      <div
        className={clsx(styles.container, className)}
        style={width ? { width } : undefined}
      >
        {label && <Skeleton width={60} height={14} borderRadius={4} />}
        <Skeleton
          height={40}
          width="100%"
          borderRadius={5}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={clsx(styles.container, className, {
        [styles.disabled]: disabled,
        [styles.is__open]: isOpen
      })}
      style={width ? { width } : undefined}
    >
      {label && (
        <div className={styles.label__wrapper}>
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
          {helper && <span className={styles.helper__text}>{helper}</span>}
        </div>
      )}

      {name && <input type={HTMLAttributeType.hidden} name={name} value={currentValue} />}

      <button
        id={inputId}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onKeyDown={handleKeyDown}
        type={HTMLAttributeType.button}
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(styles.trigger, styles.size__md, {
          [styles.open]: isOpen
        })}
      >
        <div className={styles.trigger__content}>
          {selectedOption?.icon && (
            <span className={styles.trigger__icon}>
              {selectedOption.icon}
            </span>
          )}
          <span className={styles.trigger__text}>
            {selectedOption?.label}
          </span>
        </div>
        <span
          className={clsx(styles.chevron, {
            [styles.open]: isOpen
          })}
        >
          <FaChevronDown size={11} />
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          className={styles.menu}
        >
          {normalizedOptions.map((opt, index) => {
            const isSelected = opt.value === currentValue;
            const isHighlighted = index === highlightedIndex;

            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={clsx(styles.option, {
                  [styles.selected]: isSelected,
                  [styles.highlighted]: isHighlighted,
                  [styles.disabled]: opt.disabled
                })}
              >
                <div className={styles.option__content}>
                  {opt.icon && <span className={styles.option__icon}>{opt.icon}</span>}
                  <span className={styles.option__label}>{opt.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
