import { Routes } from '@/constants/enums';
import { arrayMove } from '@dnd-kit/sortable';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { DeedIdsInterface, HandleDragEndProps } from './interface';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const { DEEDS_REORDER_TOOLTIP } = PLACEHOLDERS;

export const handleDragEnd = ({ event, setDeeds, updateHasanaatItemDisplayOrder }: HandleDragEndProps) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const result: { reordered?: DeedIdsInterface[] } = {};
  let parentDeedItemId: string | null = null;

  setDeeds(items => {
    const activeItem = items.find(item => item.id === active.id);

    parentDeedItemId = activeItem?.parent_deed_item_id ?? null;

    const newIndex = items.findIndex(item => item.id === over.id);
    const oldIndex = items.findIndex(item => item.id === active.id);

    result.reordered = arrayMove(items, oldIndex, newIndex);

    return result.reordered;
  });

  if (result.reordered) {
    updateHasanaatItemDisplayOrder({
      parent_deed_item_id: parentDeedItemId,
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