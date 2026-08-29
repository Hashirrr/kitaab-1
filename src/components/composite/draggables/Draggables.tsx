'use client';

import SkeletonCard from './SkeletonCard';
import { useEffect, useState } from 'react';
import DraggableCard from './DraggableCard';
import styles from './draggables.module.css';
import { getDeedIds } from '@/app/deeds/utils';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DeedIdsInterface, DraggablesProps } from './interface';
import { getSkeletonCardsNumber, handleDragEnd } from './utils';
import { useIsMobile, useIsTablet } from '@/store/slices/utils';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useGetDeeds, useUpdateDeedsDisplayOrder } from '@/hooks/deeds/hook';
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';

export default function Draggables({ deedsData, variant }: DraggablesProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { STEPPER_NO_DEEDS } = PLACEHOLDERS;
  const [mounted, setMounted] = useState(false);
  const { isPending: isGetDeedsPending } = useGetDeeds();
  const [deeds, setDeeds] = useState<DeedIdsInterface[]>(getDeedIds(deedsData));
  const { mutate: updateDeedsDisplayOrder } = useUpdateDeedsDisplayOrder();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setDeeds(getDeedIds(deedsData));
  }, [deedsData]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5
      }
    })
  );

  if (!mounted || isGetDeedsPending) {
    return (
      <div className={styles.container}>
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd({ event, setDeeds, updateDeedsDisplayOrder })}
      >
        <SortableContext items={deeds.map((d) => d.id)} strategy={rectSortingStrategy}>
          <div className={styles.grid}>
            {deedsData?.length ? deeds.map(({ id }) => {
              const deed = deedsData.find((item) => String(item.deed_item_id) === id);

              if (!deed) return null;
              return <DraggableCard key={id} id={id} deed={deed} variant={variant} disabled={deedsData.length === 1} />
            }
            ) : <p className={styles.no__data}>{STEPPER_NO_DEEDS}</p>}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};