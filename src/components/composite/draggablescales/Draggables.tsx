'use client';

import AddScaleCard from './AddScaleCard';
import SkeletonCard from './SkeletonCard';
import { QUERY } from '@/constants/query';
import { useEffect, useState } from 'react';
import DraggableCard from './DraggableCard';
import styles from './draggables.module.css';
import { getScaleIds } from '@/app/deeds/utils';
import { ScaleIdsInterface } from './interface';
import { useIsMutating } from '@tanstack/react-query';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { getSkeletonCardsNumber, handleDragEnd } from './utils';
import { useIsMobile, useIsTablet } from '@/store/slices/utils';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useGetScales, useUpdateScalesDisplayOrder } from '@/hooks/scales/hook';
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';

export default function DraggableScales() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { scales: scalesQuery, create } = QUERY;
  const [mounted, setMounted] = useState(false);
  const { mutate: updateScalesDisplayOrder } = useUpdateScalesDisplayOrder();
  const isCreateScalesPending = useIsMutating({ mutationKey: [scalesQuery, create] }) > 0;
  const { data: getScales, isPending: isGetScalesPending, isFetching: isGetScalesFetching } = useGetScales();
  const [scales, setScales] = useState<ScaleIdsInterface[]>(getScaleIds(getScales));

  useEffect(() => setMounted(true), []);

  useEffect(() => setScales(getScaleIds(getScales)), [getScales]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5
      }
    })
  );

  const isInitialLoading = isGetScalesPending || (isCreateScalesPending && !getScales?.length) || (isGetScalesFetching && !getScales?.length);

  if (!mounted || isInitialLoading) {
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
        onDragEnd={(event) => handleDragEnd({ event, setScales, updateScalesDisplayOrder })}
      >
        <SortableContext items={scales.map((d) => d.id)} strategy={rectSortingStrategy}>
          <div className={styles.grid}>
            {scales.map(({ id }) => {
              const scale = getScales?.find((item) => String(item.scale_items_id) === id);

              if (!scale) return null;
              return <DraggableCard key={id} id={id} scale={scale} disabled={getScales?.length === 1} />;
            })}
            <AddScaleCard />
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};