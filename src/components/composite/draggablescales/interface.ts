import { DragEndEvent } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';
import { ScaleItem } from '@/hooks/scales/interface';
import type { UseMutateFunction } from '@tanstack/react-query';
import { DeedItem, UpdateDeedsDisplayOrderPayload } from '@/hooks/deeds/interface';

export interface ScaleIdsInterface {
  id: string;
};

export interface DraggableCardProps {
  id: string;
  scale: ScaleItem;
  disabled: boolean;
};

export interface HandleDragEndProps {
  event: DragEndEvent;
  setScales: Dispatch<SetStateAction<ScaleIdsInterface[]>>;
  updateDeedsDisplayOrder: UseMutateFunction<unknown, Error, UpdateDeedsDisplayOrderPayload, unknown>;
};