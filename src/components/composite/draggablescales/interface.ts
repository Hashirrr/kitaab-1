import { DragEndEvent } from '@dnd-kit/core';
import { Dispatch, SetStateAction } from 'react';
import type { UseMutateFunction } from '@tanstack/react-query';
import { ScaleItem, UpdateScalesDisplayOrderPayload } from '@/hooks/scales/interface';

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
  updateScalesDisplayOrder: UseMutateFunction<unknown, Error, UpdateScalesDisplayOrderPayload, unknown>;
};