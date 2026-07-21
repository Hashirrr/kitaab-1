import { RootState } from '@/store';

export const selectViewportWidth = (state: RootState) =>
  state.ui.viewport.width;

export const selectSidebarExpanded = (state: RootState) =>
  state.ui.sidebarExpanded;

export const selectModal = (state: RootState) =>
  state.ui.modal;

export const selectDeedCategory = (state: RootState) =>
  state.ui.deedCategory;