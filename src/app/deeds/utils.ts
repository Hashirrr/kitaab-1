import { Routes } from '@/constants/enums';
import { DeedItem } from '@/hooks/deeds/interface';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const getDeedIds = (deeds: DeedItem[] | undefined) =>(deeds || []).map((deed: DeedItem) => ({ id: deed?.deed_item_id || '', parent_deed_item_id: deed?.parent_deed_item_id ?? null }));

export const handleAddNewDeed = (router: AppRouterInstance) => router.push(Routes.new_deeds);