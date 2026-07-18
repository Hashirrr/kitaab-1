export interface UIState {
  sidebarExpanded: boolean,
  viewport: {
    width: number,
    height: number
  }
};

export interface ViewportPayload {
  width: number;
  height: number;
};