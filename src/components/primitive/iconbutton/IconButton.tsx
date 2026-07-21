import clsx from 'clsx';
import styles from './iconbutton.module.css';
import { IconButtonProps } from './interface';
import { Cursor, IconButtonBackground } from '@/constants/enums';

export default function IconButton({ cursor, icon, variant, shadow = false, ...props }: IconButtonProps) {
  return (
    <button {...props} className={
      clsx(styles.icon__button, { 
        [styles.shadow]: shadow,
        [styles.cursor__grab]: cursor == Cursor.grab,
        [styles.cursor__pointer]: cursor == Cursor.pointer,
        [styles.primary__background]: variant == IconButtonBackground.primary,
        [styles.secondary__background]: variant == IconButtonBackground.secondary
      })
    }>
      {icon}
    </button>
  );
};