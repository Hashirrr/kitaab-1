import { DragEndEvent } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';
import type { UseMutateFunction } from '@tanstack/react-query';
import { DeedItem, UpdateHasanaatItemDisplayOrderPayload } from '@/hooks/deeds/interface';

export interface DraggablesProps {
  variant?: string;
  deedsData?: DeedItem[];
}

export interface DeedIdsInterface {
  id: string;
  parent_deed_item_id: string | null;
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
  updateHasanaatItemDisplayOrder: UseMutateFunction<unknown, Error, UpdateHasanaatItemDisplayOrderPayload, unknown>;
}