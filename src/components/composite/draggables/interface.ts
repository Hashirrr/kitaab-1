import { DragEndEvent } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';
import { DeedItem } from '@/hooks/deeds/interface';

export interface DraggablesProps {
  variant?: string;
  deedsData?: DeedItem[];
}

export interface DeedIdsInterface {
  id: string;
};

export interface DraggableCardProps {
  id: string;
  deed: DeedItem;
  variant?: string;
  disabled: boolean;
};

export interface HandleDragEndProps {
  event: DragEndEvent;
  setDeeds: Dispatch<SetStateAction<DeedIdsInterface[]>>;
}