import { PLACEHOLDERS } from '@/constants/placeholders';

export const isNestedRoute = (pathname: string) =>
  pathname.split('/').filter(Boolean).length > 1;

export const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/deeds')) return PLACEHOLDERS.PAGE_NAME_DEEDS;
  if (pathname.startsWith('/records')) return PLACEHOLDERS.SIDEBAR_LI_RECORDS;
  if (pathname.startsWith('/support')) return PLACEHOLDERS.SIDEBAR_LI_SUPPORT;
  if (pathname.startsWith('/settings')) return PLACEHOLDERS.SIDEBAR_BTN_SETTINGS;
  if (pathname.startsWith('/dashboard')) return PLACEHOLDERS.SIDEBAR_LI_DASHBOARD;
  if (pathname.startsWith('/notifications')) return PLACEHOLDERS.SIDEBAR_LI_NOTIFICATIONS;
  return PLACEHOLDERS.PAGE_NAME_DEEDS;
};