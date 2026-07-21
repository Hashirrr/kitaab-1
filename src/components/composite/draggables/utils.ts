import { arrayMove } from '@dnd-kit/sortable';
import { HandleDragEndProps } from './interface';

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