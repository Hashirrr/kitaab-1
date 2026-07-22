import { initialState } from './initialState';
import { DeedCategory, ModalCTA } from '@/constants/enums';
import { ModalPayload, ViewportPayload } from './interface';
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

      state.sidebarExpanded = false;
      state.viewport.width = width;
      state.viewport.height = height;
    },
    openModal(state, action: PayloadAction<ModalPayload>) {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.title = action.payload.title;
      state.modal.deedId = action.payload.deedId;
      state.modal.cancelText = action.payload.cancelText || ModalCTA.cancel;
      state.modal.confirmText = action.payload.confirmText || ModalCTA.confirm;
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
export const { setSidebarExpanded, setViewport, openModal, closeModal, setDeedCategory } = uiSlice.actions;