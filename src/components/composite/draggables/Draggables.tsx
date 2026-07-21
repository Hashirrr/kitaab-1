'use client';

import { handleDragEnd } from './utils';
import { useEffect, useState } from 'react';
import DraggableCard from './DraggableCard';
import styles from './draggables.module.css';
import { DeedIdsInterface } from './interface';
import { getDeedIds } from '@/app/deeds/utils';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';

export default function Draggables() {
    
  const [mounted, setMounted] = useState(false);
  const [deeds, setDeeds] = useState<DeedIdsInterface[]>(getDeedIds());

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <DndContext
        modifiers={[restrictToWindowEdges]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd({ event, setDeeds })}
      >
        <SortableContext
          items={deeds.map((d) => d.id)}
          strategy={rectSortingStrategy}
        >
          <div className={styles.grid}>
            {deeds.map((deed) => (
              <DraggableCard key={deed.id} deed={deed} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}