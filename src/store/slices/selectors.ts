import { RootState } from '@/store';

export const selectViewportWidth = (state: RootState) =>
  state.ui.viewport.width;

export const selectSidebarExpanded = (state: RootState) =>
  state.ui.sidebarExpanded;

export const selectModal = (state: RootState) =>
  state.ui.modal;

export const selectDeedCategory = (state: RootState) =>
  state.ui.deedCategory;

export const selectOpenModalStep = (state: RootState) =>
  state.ui.openModalStep;

export const selectCurrentDeedId = (state: RootState) =>
  state.ui.currentDeedId;

export const selectCurrentScaleId = (state: RootState) =>
  state.ui.currentScaleId;

export const selectMode = (state: RootState) =>
  state.ui.mode;