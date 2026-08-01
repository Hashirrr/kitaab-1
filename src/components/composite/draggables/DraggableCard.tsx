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
import { Cursor, DeedTypes, IconButtonBackground, ModalTypes } from '@/constants/enums';

export default function DraggableCard({ id, deed, disabled }: DraggableCardProps) {
  const {
    NONE,
    DRAGGABLE_CARD_KEY_TYPE,
    DRAGGABLE_CARD_KEY_ADDED,
    DRAGGABLE_CARD_KEY_SUB_DEEDS,
    DRAGGABLE_CARD_BTN_VIEW_DETAILS,
    DRAGGABLE_CARD_KEY_LAST_RECORDED
  } = PLACEHOLDERS;
  const dispatch = useAppDispatch();
  const { name, created_at } = deed;
  const subDeedsLength = deed.children?.length || NONE;
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.card, { [styles.dragging]: isDragging })}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <h3 className={styles.title}>{name}</h3>
      <hr className={styles.fading__line} />
      <dl className={styles.key__values}>
        <dt>{DRAGGABLE_CARD_KEY_TYPE}</dt>
        <dd>{DeedTypes.scale}</dd>
        <dt>{DRAGGABLE_CARD_KEY_ADDED}</dt>
        <dd>{fromNow(created_at)}</dd>
        <dt>{DRAGGABLE_CARD_KEY_SUB_DEEDS}</dt>
        <dd>{subDeedsLength}</dd>
        <dt>{DRAGGABLE_CARD_KEY_LAST_RECORDED}</dt>
        <dd>{fromNow(new Date())}</dd>
      </dl>

      <div className={styles.btn__container}>
        <button className={styles.details}>{DRAGGABLE_CARD_BTN_VIEW_DETAILS}</button>
        <IconButton
          cursor={Cursor.grab}
          icon={<IoMdMove size={20}/>}
          variant={IconButtonBackground.primary}
          {...(!disabled ? listeners : {})}
          {...(!disabled ? attributes : {})}
          disabled={disabled}
        />
        <IconButton
          cursor={Cursor.pointer}
          icon={<MdDelete size={20}/>}
          variant={IconButtonBackground.primary}
          onClick={() => dispatch(openModal(ModalTypes.delete_deed))}
        />
      </div>
    </div>
  );
}