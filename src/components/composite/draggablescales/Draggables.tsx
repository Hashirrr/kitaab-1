'use client';

import SkeletonCard from './SkeletonCard';
import { useEffect, useState } from 'react';
import DraggableCard from './DraggableCard';
import styles from './draggables.module.css';
import { getScaleIds } from '@/app/deeds/utils';
import { ScaleIdsInterface } from './interface';
import { useGetScales } from '@/hooks/scales/hook';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { getSkeletonCardsNumber, handleDragEnd } from './utils';
import { useIsMobile, useIsTablet } from '@/store/slices/utils';
import { useUpdateDeedsDisplayOrder } from '@/hooks/deeds/hook';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';

export default function DraggableScales() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { STEPPER_NO_DEEDS } = PLACEHOLDERS;
  const { data: getScales } = useGetScales();
  const [mounted, setMounted] = useState(false);
  const { isPending: isGetScalesPending } = useGetScales();
  const { mutate: updateDeedsDisplayOrder } = useUpdateDeedsDisplayOrder();
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

  if (!mounted) return null;
  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd({ event, setScales, updateDeedsDisplayOrder })}
      >
        <SortableContext items={scales.map((d) => d.id)} strategy={rectSortingStrategy}>
          {!isGetScalesPending ? <div className={styles.grid}>
            {getScales?.length ? scales.map(({ id }) => {
                const scale = getScales.find((item) => String(item.scale_items_id) === id);
                
                if (!scale) return null;
                return <DraggableCard key={id} id={id} scale={scale} disabled={getScales.length === 1} /> 
              }
            ): <p className={styles.no__data}>{STEPPER_NO_DEEDS}</p>}
          </div>:
          <div className={styles.grid}>
            {Array.from({ length: getSkeletonCardsNumber(isMobile, isTablet) }).map((_, i) => (<SkeletonCard key={i} /> ))}
          </div>}
        </SortableContext>
      </DndContext>
    </div>
  );
};