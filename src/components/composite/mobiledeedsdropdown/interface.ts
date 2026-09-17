import type { DeedItem } from '@/hooks/deeds/interface';

export interface MobileDeedsDropdownProps {
  deeds: DeedItem[];
  isPending: boolean;
  currentDeedId: string | undefined;
  onSelectDeed: (deedId: string) => void;
  checkedSubDeeds: Record<string, boolean>;
  onToggleSubDeed: (subDeedId: string) => void;
}