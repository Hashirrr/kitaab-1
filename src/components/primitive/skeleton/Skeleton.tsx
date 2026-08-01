'use client';

import clsx from 'clsx';
import styles from './skeleton.module.css';
import { SkeletonProps } from './interface';

export default function Skeleton({ width, height, borderRadius, className }: SkeletonProps) {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{ width, height, borderRadius }}
    />
  );
}