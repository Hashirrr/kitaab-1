import { initialState } from './initialState';
import { ViewportPayload } from './interface';
import { DeedCategory } from '@/constants/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarExpanded(state, action: PayloadAction<boolean>) {
      state.sidebarExpanded = action.payload;
    },
    setViewport(state, action: PayloadAction<ViewportPayload>) {
      const { width, height } = action.payload;

      state.viewport.width = width;
      state.sidebarExpanded = false;
      state.viewport.height = height;
    },
    openModal(state, action: PayloadAction<string>) {
      state.modal.isOpen = true;
      state.modal.type = action.payload;
    },
    setModalError(state, action: PayloadAction<string>) {
      state.modal.error = action.payload;
      state.modal.disabled = !!action.payload;
    },
    incementOpenModalStep(state) {
      state.openModalStep++;
    },
    incementMoreOpenModalStep(state, action: PayloadAction<number>) {
      state.openModalStep = action.payload;
    },
    resetOpenModalStep(state) {
      state.openModalStep = 1;
    },
    closeModal(state) {
      state.modal.isOpen = false;
    },
    setDeedCategory(state, action: PayloadAction<DeedCategory>) {
      state.deedCategory = action.payload;
    }
  }
});

export default uiSlice.reducer;

export const {
  openModal,
  closeModal,
  setViewport,
  setModalError,
  setDeedCategory,
  setSidebarExpanded,
  resetOpenModalStep,
  incementOpenModalStep,
  incementMoreOpenModalStep
} = uiSlice.actions;