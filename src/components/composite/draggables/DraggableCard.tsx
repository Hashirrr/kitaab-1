import clsx from 'clsx';
import { CSS } from '@dnd-kit/utilities';
import { IoMdMove } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { useAppDispatch } from '@/store/hooks';
import { fromNow } from '@/store/slices/utils';
import { useSortable } from '@dnd-kit/sortable';
import styles from './draggablecard.module.css';
import { DraggableCardProps } from './interface';
import { openModal } from '@/store/slices/uiSlice';
import { PLACEHOLDERS } from '@/constants/placeholders';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { deeds, getDeedById, getSubDeedsById } from '@/app/deeds/utils';
import { Cursor, IconButtonBackground, ModalCTA } from '@/constants/enums';

export default function DraggableCard({ deed }: DraggableCardProps) {
  const {
    DRAGGABLE_CARD_KEY_TYPE,
    MODAL_DELETE_DEED_TITLE,
    DRAGGABLE_CARD_KEY_ADDED,
    DRAGGABLE_CARD_KEY_SUB_DEEDS,
    MODAL_DELETE_DEED_DESCRIPTION,
    DRAGGABLE_CARD_BTN_VIEW_DETAILS,
    DRAGGABLE_CARD_KEY_LAST_RECORDED
  } = PLACEHOLDERS;
  const { id } = deed;
  const dispatch = useAppDispatch();
  const isMoveDisabled = deeds.length === 1;
  const { name, scale_type, created_at, last_recorded } = getDeedById(Number(id))!;
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({ id, disabled: isMoveDisabled });

  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.card, { [styles.dragging]: isDragging })}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div>
        <h3 className={styles.title}>{name}</h3>
        <hr className={styles.fading__line} />
        <dl className={styles.key__values}>
          <dt>{DRAGGABLE_CARD_KEY_TYPE}</dt>
          <dd>{scale_type}</dd>
          <dt>{DRAGGABLE_CARD_KEY_ADDED}</dt>
          <dd>{fromNow(created_at)}</dd>
          <dt>{DRAGGABLE_CARD_KEY_SUB_DEEDS}</dt>
          <dd>{getSubDeedsById(Number(id))}</dd>
          <dt>{DRAGGABLE_CARD_KEY_LAST_RECORDED}</dt>
          <dd>{fromNow(last_recorded)}</dd>
        </dl>
        <div className={styles.btn__container}>
          <button className={styles.details}>{DRAGGABLE_CARD_BTN_VIEW_DETAILS}</button>
          <IconButton
            cursor={Cursor.grab}
            icon={<IoMdMove size={20}/>}
            variant={IconButtonBackground.primary}
            {...(!isMoveDisabled ? listeners : {})}
            {...(!isMoveDisabled ? attributes : {})}
            disabled={isMoveDisabled}
          />
          <IconButton
            cursor={Cursor.pointer}
            icon={<MdDelete size={20}/>}
            variant={IconButtonBackground.primary}
            onClick={() =>
              dispatch(openModal({
                deedId: Number(id),
                confirmText: ModalCTA.delete,
                title: MODAL_DELETE_DEED_TITLE,
                description: MODAL_DELETE_DEED_DESCRIPTION
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}