import { UIState } from './interface';
import { DeedCategory } from '@/constants/enums';

export const initialState: UIState = {
  sidebarExpanded: false,
  viewport: {
    width: 0,
    height: 0,
  },
  modal: {
    title: '',
    isOpen: false,
    cancelText: '',
    description: '',
    confirmText: '',
    deedId: 0
  },
  deedCategory: DeedCategory.hasanaat,
};