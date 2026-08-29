import { initialState } from './initialState';
import { ViewportPayload } from './interface';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeedCategory, LocalStorage, Mode } from '@/constants/enums';

const { UNDEFINED } = PLACEHOLDERS;

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
    setOpenModalStep(state, action: PayloadAction<number>) {
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
      if (typeof window !== UNDEFINED) {
        localStorage.setItem(LocalStorage.deed_category, action.payload);
      }
    },
    setMode(state, action: PayloadAction<Mode>) {
      state.mode = action.payload;
      if (typeof window !== UNDEFINED) {
        localStorage.setItem(LocalStorage.mode, action.payload);
        document.documentElement.classList.toggle(Mode.dark, action.payload === Mode.dark);
      }
    },
    setCurrentDeedId(state, action: PayloadAction<string>) {
      state.currentDeedId = action.payload;
    },
    setCurrentScaleId(state, action: PayloadAction<string>) {
      state.currentScaleId = action.payload;
    }
  }
});

export default uiSlice.reducer;

export const {
  setMode,
  openModal,
  closeModal,
  setViewport,
  setModalError,
  setDeedCategory,
  setCurrentDeedId,
  setOpenModalStep,
  setCurrentScaleId,
  setSidebarExpanded,
  resetOpenModalStep,
  incementOpenModalStep
} = uiSlice.actions;