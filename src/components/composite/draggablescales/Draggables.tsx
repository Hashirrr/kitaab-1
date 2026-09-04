'use client';

import { handleDragEnd } from './utils';
import AddScaleCard from './AddScaleCard';
import SkeletonCard from './SkeletonCard';
import { useEffect, useState } from 'react';
import DraggableCard from './DraggableCard';
import styles from './draggables.module.css';
import { getScaleIds } from '@/app/deeds/utils';
import { ScaleIdsInterface } from './interface';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useGetScales, useUpdateScalesDisplayOrder } from '@/hooks/scales/hook';
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';

export default function DraggableScales() {
  const [mounted, setMounted] = useState(false);
  const { mutate: updateScalesDisplayOrder } = useUpdateScalesDisplayOrder();
  const { data: getScales, isPending: isGetScalesPending } = useGetScales();
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

  if (!mounted || isGetScalesPending) {
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