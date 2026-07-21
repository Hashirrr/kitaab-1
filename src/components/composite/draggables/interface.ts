import { DragEndEvent } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';

export interface DeedIdsInterface {
  id: string;
};

export interface DraggableCardProps {
  deed: {
    id: string;
  }
};

export interface HandleDragEndProps {
  event: DragEndEvent;
  setDeeds: Dispatch<SetStateAction<DeedIdsInterface[]>>;
}