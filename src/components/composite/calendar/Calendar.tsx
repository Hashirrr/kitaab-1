'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import styles from './calendar.module.css';
import { CalendarProps } from './interface';
import { HTMLAttributeType } from '@/constants/enums';
import { LuChevronLeft, LuChevronRight, LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';
import { DAYS_OF_WEEK, handleNextMonth, handleNextYear, handlePrevMonth, handlePrevYear, handleSelectDate, handleJumpToLatest, handleJumpToSelected, generateCalendarMatrix } from './utils';

export default function Calendar({ value, latestRecordedDate, onChange }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(value ? dayjs(value) : dayjs());
    const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(value ? dayjs(value) : dayjs());

    const days = generateCalendarMatrix(currentMonth, selectedDate, latestRecordedDate);

    const hijriDateEnglish = useMemo(() => {
        try {
            return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(selectedDate.toDate());
        } catch {
            return '';
        }
    }, [selectedDate]);

    const hijriDateArabic = useMemo(() => {
        try {
            return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(selectedDate.toDate());
        } catch {
            return '';
        }
    }, [selectedDate]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.records__card}>
                    <div className={styles.records__meta}>
                        <span className={styles.records__badge}>Daily Ledger • سجل اليوم</span>
                        {hijriDateArabic && (
                            <span className={styles.records__hijri_ar}>{hijriDateArabic}</span>
                        )}
                    </div>
                    <span className={styles.records__date}>
                        {selectedDate.format('dddd, MMMM D, YYYY')}
                    </span>
                    {hijriDateEnglish && (
                        <span className={styles.records__hijri_en}>
                            {hijriDateEnglish}
                        </span>
                    )}
                </div>

                <div className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.month__title}>
                            {currentMonth.format('MMMM YYYY')}
                        </span>
                        <div className={styles.nav__buttons}>
                            <button
                                title='Previous Year'
                                aria-label='Previous Year'
                                className={styles.nav__btn}
                                type={HTMLAttributeType.button}
                                onClick={() => handlePrevYear(setCurrentMonth)}
                            >
                                <LuChevronsLeft size={14} />
                            </button>
                            <button
                                title='Previous Month'
                                aria-label='Previous Month'
                                className={styles.nav__btn}
                                type={HTMLAttributeType.button}
                                onClick={() => handlePrevMonth(setCurrentMonth)}
                            >
                                <LuChevronLeft size={14} />
                            </button>
                            <button
                                type={HTMLAttributeType.button}
                                onClick={() => handleNextMonth(setCurrentMonth)}
                                title='Next Month'
                                aria-label='Next Month'
                                className={styles.nav__btn}
                            >
                                <LuChevronRight size={14} />
                            </button>
                            <button
                                title='Next Year'
                                aria-label='Next Year'
                                className={styles.nav__btn}
                                type={HTMLAttributeType.button}
                                onClick={() => handleNextYear(setCurrentMonth)}
                            >
                                <LuChevronsRight size={14} />
                            </button>
                        </div>
                    </div>

                    <hr className={styles.fading__line} />

                    <div className={styles.weekdays__grid}>
                        {DAYS_OF_WEEK.map((day, index) => (
                            <span key={index} className={styles.weekday}>
                                {day}
                            </span>
                        ))}
                    </div>

                    <div className={styles.days__grid}>
                        {days.map((day, index) => (
                            <button
                                key={index}
                                type={HTMLAttributeType.button}
                                onClick={() =>
                                    handleSelectDate({
                                        date: day.date,
                                        onChange,
                                        setSelectedDate,
                                        setCurrentMonth
                                    })
                                }
                                className={clsx(styles.day__cell, {
                                    [styles.other__month]: !day.isCurrentMonth,
                                    [styles.latest]: day.isLatest,
                                    [styles.selected]: day.isSelected
                                })}
                            >
                                {day.dayNumber}
                            </button>
                        ))}
                    </div>

                    <hr className={styles.fading__line} />

                    <div className={styles.footer}>
                        <button
                            title='Jump to selected date'
                            className={styles.footer__btn}
                            type={HTMLAttributeType.button}
                            disabled={currentMonth.isSame(selectedDate, 'month')}
                            onClick={() => handleJumpToSelected(selectedDate, setCurrentMonth)}
                        >
                            Selected: {selectedDate.format('D MMM YY')}
                        </button>
                        {latestRecordedDate && (
                            <button
                                className={styles.footer__btn}
                                type={HTMLAttributeType.button}
                                title='Jump to latest recorded date'
                                disabled={selectedDate.isSame(dayjs(latestRecordedDate), 'day')}
                                onClick={() =>
                                    handleJumpToLatest({
                                        latestRecordedDate,
                                        onChange,
                                        setSelectedDate,
                                        setCurrentMonth
                                    })
                                }
                            >
                                Latest: {dayjs(latestRecordedDate).format('D MMM YY')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
