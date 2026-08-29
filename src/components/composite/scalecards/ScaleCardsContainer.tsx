import clsx from 'clsx';
import { useState } from 'react';
import { QUERY } from '@/constants/query';
import { ModalTypes } from '@/constants/enums';
import { cards, defaultScales } from './utils';
import styles from './scalecardscontainer.module.css';
import { useQueryClient } from '@tanstack/react-query';
import { PLACEHOLDERS } from '@/constants/placeholders';
import DraggableScales from '../draggablescales/Draggables';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentDeedId } from '@/store/slices/selectors';
import { useCreateScales, useGetScales } from '@/hooks/scales/hook';
import { openModal, resetOpenModalStep } from '@/store/slices/uiSlice';

export default function ScaleCardsContainer() {
  const { scales } = QUERY;
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { data: getScales } = useGetScales();
  const [selected, setSelected] = useState(0);
  const { mutate: createScales } = useCreateScales();
  const deedId = useAppSelector(selectCurrentDeedId);
  const { SCALES_EXAMPLE, SCALES_SELECT, SCALES_SELECTED } = PLACEHOLDERS;

  return (
    selected !== 0 || !!getScales?.length ? <DraggableScales /> :
      <div className={styles.grid}>
        {cards.map((item, index) => (
          <article key={index} className={styles.card}>
            <header className={styles.title}>
              <h3>{item.name}</h3>
            </header>

            <hr className={styles.fading__line} />

            <section className={styles.content}>
              <h4>{item.h4}</h4>
              <p>{item.p}</p>
            </section>

            <aside className={styles.example}>
              <span className={styles.example__label}>{SCALES_EXAMPLE}</span>
              <strong>{item.deed}</strong>
              {item.example}
            </aside>
            <button className={clsx(styles.select, {
              [styles.selected]: selected === index
            })} onClick={() => {
              setSelected(index);
              if (index === 1) createScales(defaultScales);
              if (index === 2) {
                dispatch(resetOpenModalStep());
                dispatch(openModal(ModalTypes.add_scale));
              }
              queryClient.invalidateQueries({ queryKey: [scales, deedId] });
            }}>{selected === index ? SCALES_SELECTED : SCALES_SELECT}</button>
          </article>
        ))}
      </div>
  );
};