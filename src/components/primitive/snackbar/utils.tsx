import styles from './snackbar.module.css';
import { SnackbarVariant } from "@/constants/enums";
import { FaCircleExclamation, FaCircleCheck, FaTriangleExclamation, FaCircleInfo } from 'react-icons/fa6';

export const getVariantIcon = (variant?: SnackbarVariant) => {
  switch (variant) {
    case SnackbarVariant.error:
      return <FaCircleExclamation className={styles.icon} />;
    case SnackbarVariant.success:
      return <FaCircleCheck className={styles.icon} />;
    case SnackbarVariant.warning:
      return <FaTriangleExclamation className={styles.icon} />;
    case SnackbarVariant.info:
      return <FaCircleInfo className={styles.icon} />;
    default:
      return null;
  }
};