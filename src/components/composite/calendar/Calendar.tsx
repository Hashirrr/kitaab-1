'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import styles from './calendar.module.css';
import { useEffect, useState } from 'react';
import { CalendarProps } from './interface';
import { HTMLAttributeType } from '@/constants/enums';
import { FaAnglesLeft, FaAnglesRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { DAYS_OF_WEEK, handleNextMonth, handleNextYear, handlePrevMonth, handlePrevYear, handleSelectDate, generateCalendarMatrix } from './utils';

export default function Calendar({ value, latestRecordedDate, onChange }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(value ? dayjs(value) : null);
    const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(value ? dayjs(value) : (latestRecordedDate ? dayjs(latestRecordedDate) : dayjs()));

    useEffect(() => {
        if (value) {
            const valObj = dayjs(value);
            setSelectedDate(valObj);
            setCurrentMonth(valObj);
        } else {
            setSelectedDate(null);
            if (latestRecordedDate) setCurrentMonth(dayjs(latestRecordedDate));
        }
    }, [value, latestRecordedDate]);

    const days = generateCalendarMatrix(currentMonth, selectedDate, latestRecordedDate);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.records__card}>
                    <span className={styles.records__date}>
                        {selectedDate ? selectedDate.format('MMMM D, YYYY') : '\u00A0'}
                    </span>
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
                                <FaAnglesLeft size={10} />
                            </button>
                            <button
                                title='Previous Month'
                                aria-label='Previous Month'
                                className={styles.nav__btn}
                                type={HTMLAttributeType.button}
                                onClick={() => handlePrevMonth(setCurrentMonth)}
                            >
                                <FaChevronLeft size={10} />
                            </button>
                            <button
                                type={HTMLAttributeType.button}
                                onClick={() => handleNextMonth(setCurrentMonth)}
                                title='Next Month'
                                aria-label='Next Month'
                                className={styles.nav__btn}
                            >
                                <FaChevronRight size={10} />
                            </button>
                            <button
                                title='Next Year'
                                aria-label='Next Year'
                                className={styles.nav__btn}
                                type={HTMLAttributeType.button}
                                onClick={() => handleNextYear(setCurrentMonth)}
                            >
                                <FaAnglesRight size={10} />
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
                </div>
            </div>
        </div>
    );
};
