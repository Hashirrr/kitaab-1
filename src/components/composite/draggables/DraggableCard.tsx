import clsx from 'clsx';
import { FaPen } from "react-icons/fa6";
import { handleViewDeed } from './utils';
import { CSS } from '@dnd-kit/utilities';
import { IoMdMove } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { fromNow } from '@/store/slices/utils';
import { useSortable } from '@dnd-kit/sortable';
import styles from './draggablecard.module.css';
import { DraggableCardProps } from './interface';
import { BsFillInfoCircleFill } from "react-icons/bs";
import { PLACEHOLDERS } from '@/constants/placeholders';
import Tooltip from '@/components/primitive/tooltip/Tooltip';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { incementOpenModalStep, openModal } from '@/store/slices/uiSlice';
import { Cursor, DeedTypes, DraggableCardVariants, IconButtonBackground, ModalTypes } from '@/constants/enums';

export default function DraggableCard({ id, deed, variant, disabled }: DraggableCardProps) {
  const {
    NONE,
    DRAGGABLE_CARD_KEY_TYPE,
    DRAGGABLE_CARD_KEY_ADDED,
    DRAGGABLE_CARD_ADD_SUB_DEED,
    DRAGGABLE_CARD_KEY_SUB_DEEDS,
    DRAGGABLE_CARD_VIEW_EDIT_DEED,
    DRAGGABLE_CARD_BTN_VIEW_DETAILS,
    DRAGGABLE_CARD_KEY_LAST_RECORDED
  } = PLACEHOLDERS;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, description, children, deed_item_id, created_at } = deed;
  const subDeedsLength = children?.length || NONE;
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.card, { [styles.dragging]: isDragging })}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <h3 className={styles.title}>
        {name}
        {description && <Tooltip content={`${description}`}>
          <BsFillInfoCircleFill />
        </Tooltip>}
      </h3>
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
        {!variant && <button
          className={styles.details}
          onClick={() => handleViewDeed(router, deed_item_id)}
        >
          {DRAGGABLE_CARD_BTN_VIEW_DETAILS}
        </button>}
        {variant === DraggableCardVariants.parent && <button
          className={styles.details}
          onClick={() => {}}
        >
          {DRAGGABLE_CARD_ADD_SUB_DEED}
        </button>}
        {variant === DraggableCardVariants.children && <button
          className={styles.details}
          onClick={() => {}}
        >
          {DRAGGABLE_CARD_VIEW_EDIT_DEED}
        </button>}
        <IconButton
          cursor={Cursor.grab}
          icon={<IoMdMove size={20}/>}
          variant={IconButtonBackground.primary}
          {...(!disabled ? listeners : {})}
          {...(!disabled ? attributes : {})}
          disabled={disabled}
        />
        {variant !== DraggableCardVariants.parent && <IconButton
          cursor={Cursor.pointer}
          icon={<MdDelete size={20}/>}
          variant={IconButtonBackground.primary}
          onClick={() => dispatch(openModal(ModalTypes.delete_deed))}
        />}
        {variant === DraggableCardVariants.parent && <IconButton
          cursor={Cursor.pointer}
          icon={<FaPen size={14} />}
          variant={IconButtonBackground.primary}
          onClick={() => {
            dispatch(incementOpenModalStep());
            dispatch(incementOpenModalStep());
            dispatch(openModal(ModalTypes.add_deed));
          }}
        />}
      </div>
    </div>
  );
};