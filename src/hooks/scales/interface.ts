export interface ScaleItem {
  name: string;
  scale_id: string;
  created_at: string;
  display_order: number;
  scale_items_id: string;
  description: string | null;
};

export interface CreateScaleItemPayload {
  name: string;
  display_order: number;
  description: string | null;
};

export interface UpdateScaleItemPayload {
  name: string;
  description: string | null;
};

export interface UpdateScalesDisplayOrderPayload {
  display_order: number[];
};