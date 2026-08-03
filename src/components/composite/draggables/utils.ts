import { Routes } from '@/constants/enums';
import { arrayMove } from '@dnd-kit/sortable';
import { HandleDragEndProps } from './interface';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const handleDragEnd = ({ event, setDeeds }: HandleDragEndProps) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setDeeds((items) => {
    const oldIndex = items.findIndex(
      (item) => item.id === String(active.id)
    );

    const newIndex = items.findIndex(
      (item) => item.id === String(over.id)
    );

    return arrayMove(items, oldIndex, newIndex);
  });
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

export const handleViewDeed = (router: AppRouterInstance, id: string) => {
  router.push(`${Routes.view_deeds}/${id}`);
};