import { cards } from './utils';
import { ModalTypes } from '@/constants/enums';
import styles from './scalecardscontainer.module.css';
import { PLACEHOLDERS } from '@/constants/placeholders';
import SkeletonCard from '../draggablescales/SkeletonCard';
import DraggableScales from '../draggablescales/Draggables';
import { useGetScale, useGetScales } from '@/hooks/scales/hook';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsChangingScaleType } from '@/store/slices/selectors';
import { openModal, setIsChangingScaleType, setPendingScaleCardIndex } from '@/store/slices/uiSlice';

export default function ScaleCardsContainer() {
  const dispatch = useAppDispatch();
  const { data: getScales } = useGetScales();
  const isChanging = useAppSelector(selectIsChangingScaleType);
  const { SCALES_EXAMPLE, SCALES_SELECT, SCALES_CHANGE_TYPE } = PLACEHOLDERS;
  const { data: scaleDetail, isPending: isScaleDetailPending } = useGetScale();
  const deedType = scaleDetail?.type?.toLowerCase() || (getScales?.length ? 'scale' : null);
  const isTypeSet = Boolean(deedType);
  const showThreeCards = !isTypeSet || isChanging;
  const canChangeType = isTypeSet && scaleDetail?.is_locked === false && !showThreeCards;

  const handleCardSelect = (index: number) => {
    dispatch(setPendingScaleCardIndex(index));
    dispatch(openModal(ModalTypes.scale_type_warning));
  };

  if (isScaleDetailPending && !scaleDetail) {
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
      {canChangeType && (
        <div className={styles.header}>
          <button
            type="button"
            className={styles.change__btn}
            onClick={() => {
              dispatch(setIsChangingScaleType(true));
            }}
          >
            {SCALES_CHANGE_TYPE}
          </button>
        </div>
      )}

      {showThreeCards ? (
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
              <button
                type="button"
                className={styles.select}
                onClick={() => handleCardSelect(index)}
              >
                {SCALES_SELECT}
              </button>
            </article>
          ))}
        </div>
      ) : deedType === 'count' ? (
        <div className={styles.grid}>
          <article className={styles.card}>
            <header className={styles.title}>
              <h3>{cards[0].name}</h3>
            </header>

            <hr className={styles.fading__line} />

            <section className={styles.content}>
              <h4>{cards[0].h4}</h4>
              <p>{cards[0].p}</p>
            </section>

            <aside className={styles.example}>
              <span className={styles.example__label}>{SCALES_EXAMPLE}</span>
              <strong>{cards[0].deed}</strong>
              {cards[0].example}
            </aside>
          </article>
        </div>
      ) : (
        <DraggableScales />
      )}
    </div>
  );
};