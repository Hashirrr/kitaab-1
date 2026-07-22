import { UIState } from './interface';
import { DeedCategory } from '@/constants/enums';

export const initialState: UIState = {
  sidebarExpanded: false,
  viewport: {
    width: 0,
    height: 0,
  },
  modal: {
    type: '',
    title: '',
    isOpen: false,
    cancelText: '',
    confirmText: '',
    deedId: 0
  },
  deedCategory: DeedCategory.hasanaat,
};