import { UIState } from './interface';
import { DeedCategory, Mode } from '@/constants/enums';

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
  endDate: '',
  startDate: '',
  openModalStep: 1,
  mode: Mode.light,
  currentDeedId: '',
  currentScaleId: '',
  deedCategory: DeedCategory.hasanaat
};