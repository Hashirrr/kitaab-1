import { Routes } from '@/constants/enums';
import { arrayMove } from '@dnd-kit/sortable';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { ScaleIdsInterface, HandleDragEndProps } from './interface';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const { DEEDS_REORDER_TOOLTIP } = PLACEHOLDERS;

export const handleDragEnd = ({ event, setScales, updateScalesDisplayOrder }: HandleDragEndProps) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const result: { reordered?: ScaleIdsInterface[] } = {};

  setScales(items => {
    const newIndex = items.findIndex(item => item.id === over.id);
    const oldIndex = items.findIndex(item => item.id === active.id);

    result.reordered = arrayMove(items, oldIndex, newIndex);

    return result.reordered;
  });

  if (result.reordered) {
    updateScalesDisplayOrder({
      display_order: result.reordered.map(item => Number(item.id))
    });
  }
};

export const getSkeletonCardsNumber = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) {
    return 1;
  } else if (isTablet) {
    return 2;
  } else {
    return 3;
  }
};

export const handleViewDeed = (router: AppRouterInstance, id: string) => router.push(`${Routes.view_deeds}/${id}`);

export const getMoveTooltip = (isUpdateHasanaatItemDisplayOrderPending: boolean) => isUpdateHasanaatItemDisplayOrderPending ? DEEDS_REORDER_TOOLTIP: '';