import { UIState } from './interface';
import { DeedCategory, Mode, SnackbarVariant } from '@/constants/enums';

export const initialState: UIState = {
  sidebarExpanded: false,
  viewport: {
    width: 0,
    height: 0,
  },
  modal: {
    type: '',
    error: '',
    isOpen: false,
    disabled: true
  },
  snackbar: {
    open: false,
    message: '',
    duration: 4000,
    variant: SnackbarVariant.default
  },
  endDate: '',
  startDate: '',
  openModalStep: 1,
  mode: Mode.light,
  currentDeedId: '',
  currentScaleId: '',
  isChangingScaleType: false,
  pendingScaleCardIndex: null,
  deedCategory: DeedCategory.hasanaat
};