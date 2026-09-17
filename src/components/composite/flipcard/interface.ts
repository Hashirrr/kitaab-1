import { ReactNode } from 'react';

export interface FlipCardProps {
  className?: string;
  children: ReactNode;
  isFlipped?: boolean;
}

export interface FlipCardSideProps {
  children: ReactNode;
  className?: string;
}