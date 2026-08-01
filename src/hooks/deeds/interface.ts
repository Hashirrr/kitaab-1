import { DeedHideTypes } from "@/constants/enums";

export interface DeedItem {
  name: string;
  deed_id: string;
  created_at: string;
  deed_item_id: string;
  display_order: number;
  children?: DeedItem[];
  hide_type: DeedHideTypes;
  description: string | null;
  parent_deed_item_id: string | null;
}

export type GetHasanaatItemsResponse = DeedItem[];