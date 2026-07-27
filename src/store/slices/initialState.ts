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
    deedId: 0,
    error: '',
    isOpen: false,
    disabled: true
  },
  openModalStep: 1,
  deedCategory: DeedCategory.hasanaat
};