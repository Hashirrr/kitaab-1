import { Routes } from '@/constants/enums';
import { DeedItem } from '@/hooks/deeds/interface';
import { PLACEHOLDERS } from '@/constants/placeholders';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const { NONE } = PLACEHOLDERS;

export const getDeedIds = (deeds: DeedItem[] | undefined) => (deeds || []).map((deed: DeedItem) => ({ id: deed?.deed_item_id || '' }));

export const deleteDeedByID = (id: number) => [];

export const handleAddNewDeed = (router: AppRouterInstance) => {
  router.push(Routes.new_deeds);
};