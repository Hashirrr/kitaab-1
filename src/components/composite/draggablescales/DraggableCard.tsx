import clsx from 'clsx';
import { CSS } from '@dnd-kit/utilities';
import { getMoveTooltip } from './utils';
import { IoMdMove } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { QUERY } from '@/constants/query';
import { useAppDispatch } from '@/store/hooks';
import { fromNow } from '@/store/slices/utils';
import { useSortable } from '@dnd-kit/sortable';
import styles from './draggablecard.module.css';
import { DraggableCardProps } from './interface';
import { useIsMutating } from '@tanstack/react-query';
import { BsFillInfoCircleFill } from "react-icons/bs";
import { PLACEHOLDERS } from '@/constants/placeholders';
import Tooltip from '@/components/primitive/tooltip/Tooltip';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { openModal, setCurrentScaleId } from '@/store/slices/uiSlice';
import { Cursor, IconButtonBackground, ModalTypes } from '@/constants/enums';

export default function DraggableCard({ id, scale, disabled }: DraggableCardProps) {
  const {
    DRAGGABLE_CARD_KEY_ADDED,
    DRAGGABLE_CARD_VIEW_EDIT_DEED
  } = PLACEHOLDERS;
  const dispatch = useAppDispatch();
  const { scales, display_order } = QUERY;
  const { name, description, scale_items_id, created_at } = scale;
  const isUpdateScaleDisplayOrderPending = useIsMutating({ mutationKey: [scales, display_order] }) > 0;
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.card, { [styles.dragging]: isDragging })}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <h3 className={styles.title}>
        {name}
        {description && <Tooltip content={description}>
          <BsFillInfoCircleFill />
        </Tooltip>}
      </h3>
      <hr className={styles.fading__line} />
      <dl className={styles.key__values}>
        <dt>{DRAGGABLE_CARD_KEY_ADDED}</dt>
        <dd>{fromNow(created_at)}</dd>
      </dl>

      <div className={styles.btn__container}>
        <button
          className={styles.details}
          onClick={() => {
            dispatch(setCurrentScaleId(scale_items_id));
            dispatch(openModal(ModalTypes.edit_scale));
          }}
        >
          {DRAGGABLE_CARD_VIEW_EDIT_DEED}
        </button>
        <Tooltip content={getMoveTooltip(isUpdateScaleDisplayOrderPending)}>
          <IconButton
            cursor={Cursor.grab}
            icon={<IoMdMove size={20} />}
            {...(!disabled ? listeners : {})}
            {...(!disabled ? attributes : {})}
            variant={IconButtonBackground.primary}
            disabled={disabled || isUpdateScaleDisplayOrderPending}
          />
        </Tooltip>
        <IconButton
          cursor={Cursor.pointer}
          icon={<MdDelete size={20} />}
          variant={IconButtonBackground.primary}
          onClick={() => {
            dispatch(setCurrentScaleId(scale_items_id));
            dispatch(openModal(ModalTypes.delete_scale));
          }}
        />
      </div>
    </div>
  );
};