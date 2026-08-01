import { DragEndEvent } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';
import { DeedItem } from '@/hooks/deeds/interface';

export interface DeedIdsInterface {
  id: string;
};

export interface DraggableCardProps {
  id: string;
  deed: DeedItem;
  disabled: boolean;
};

export interface HandleDragEndProps {
  event: DragEndEvent;
  setDeeds: Dispatch<SetStateAction<DeedIdsInterface[]>>;
}