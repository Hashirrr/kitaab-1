import clsx from 'clsx';
import { FaPen } from "react-icons/fa6";
import { CSS } from '@dnd-kit/utilities';
import { IoMdMove } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { QUERY } from '@/constants/query';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { fromNow } from '@/store/slices/utils';
import { useSortable } from '@dnd-kit/sortable';
import styles from './draggablecard.module.css';
import { DraggableCardProps } from './interface';
import { useIsMutating } from '@tanstack/react-query';
import { BsFillInfoCircleFill } from "react-icons/bs";
import { PLACEHOLDERS } from '@/constants/placeholders';
import { getMoveTooltip, handleViewDeed } from './utils';
import Tooltip from '@/components/primitive/tooltip/Tooltip';
import IconButton from '@/components/primitive/iconbutton/IconButton';
import { openModal, setCurrentDeedId, setOpenModalStep } from '@/store/slices/uiSlice';
import dayjs from 'dayjs';
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
  const { deeds, display_order } = QUERY;
  const { name, description, children, deed_item_id, created_at, type, last_recorded_at } = deed;
  const subDeedsLength = children?.length || NONE;
  const isUpdateHasanaatItemDisplayOrderPending = useIsMutating({ mutationKey: [deeds, display_order] }) > 0;
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({ id, disabled });

  const deedType = type
    ? (String(type).toLowerCase() === 'count' ? DeedTypes.count : DeedTypes.scale)
    : DeedTypes.scale;

  const getLatestRecorded = () => {
    if (last_recorded_at && dayjs(last_recorded_at).isValid()) {
      return fromNow(last_recorded_at);
    }
    if (children?.length) {
      const validChildDates = children
        .map((c) => c.last_recorded_at)
        .filter((d): d is string => Boolean(d && dayjs(d).isValid()));
      if (validChildDates.length > 0) {
        const latest = validChildDates.reduce((max, curr) =>
          dayjs(curr).isAfter(dayjs(max)) ? curr : max
        );
        return fromNow(latest);
      }
    }
    return NONE;
  };
  const lastRecorded = getLatestRecorded();

  return (
    <div
      ref={setNodeRef}
      className={clsx(styles.card, { [styles.dragging]: isDragging })}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className={styles.card__header}>
        <h3 className={styles.title}>
          {name}
          {description && <Tooltip content={`${description}`}>
            <BsFillInfoCircleFill />
          </Tooltip>}
        </h3>
        <hr className={styles.fading__line} />
      </div>
      <dl className={styles.key__values}>
        <dt>{DRAGGABLE_CARD_KEY_TYPE}</dt>
        <dd>{deedType}</dd>
        <dt>{DRAGGABLE_CARD_KEY_ADDED}</dt>
        <dd>{fromNow(created_at)}</dd>
        {variant !== DraggableCardVariants.children && <dt>{DRAGGABLE_CARD_KEY_SUB_DEEDS}</dt>}
        {variant !== DraggableCardVariants.children && <dd>{subDeedsLength}</dd>}
        <dt>{DRAGGABLE_CARD_KEY_LAST_RECORDED}</dt>
        <dd>{lastRecorded}</dd>
      </dl>

      <div className={styles.btn__container}>
        {!variant && <button
          className={styles.details}
          onClick={() => {
            handleViewDeed(router, deed_item_id);
            dispatch(setCurrentDeedId(deed_item_id));
          }}
        >
          {DRAGGABLE_CARD_BTN_VIEW_DETAILS}
        </button>}
        {variant === DraggableCardVariants.parent && <button
          className={styles.details}
          onClick={() => {
            dispatch(setOpenModalStep(5));
            dispatch(setCurrentDeedId(deed_item_id));
            dispatch(openModal(ModalTypes.add_deed));
          }}
        >
          {DRAGGABLE_CARD_ADD_SUB_DEED}
        </button>}
        {variant === DraggableCardVariants.children && <button
          className={styles.details}
          onClick={() => {
            dispatch(setCurrentDeedId(deed_item_id));
            dispatch(openModal(ModalTypes.edit_deed));
          }}
        >
          {DRAGGABLE_CARD_VIEW_EDIT_DEED}
        </button>}
        <Tooltip content={getMoveTooltip(isUpdateHasanaatItemDisplayOrderPending)}>
          <IconButton
            cursor={Cursor.grab}
            icon={<IoMdMove size={20}/>}
            {...(!disabled ? listeners : {})}
            {...(!disabled ? attributes : {})}
            variant={IconButtonBackground.primary}
            disabled={disabled || isUpdateHasanaatItemDisplayOrderPending}
          />
        </Tooltip>
        {variant !== DraggableCardVariants.parent && <IconButton
          cursor={Cursor.pointer}
          icon={<MdDelete size={20}/>}
          variant={IconButtonBackground.primary}
          onClick={() => {
            dispatch(setCurrentDeedId(deed_item_id));
            dispatch(openModal(ModalTypes.delete_deed));
          }}
        />}
        {variant === DraggableCardVariants.parent && <IconButton
          cursor={Cursor.pointer}
          icon={<FaPen size={14} />}
          variant={IconButtonBackground.primary}
          onClick={() => {
            dispatch(setCurrentDeedId(deed_item_id));
            dispatch(openModal(ModalTypes.edit_deed));
          }}
        />}
      </div>
    </div>
  );
};