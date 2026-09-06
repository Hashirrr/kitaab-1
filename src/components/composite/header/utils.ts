export const isNestedRoute = (pathname: string) =>
  pathname.split('/').filter(Boolean).length > 1;

export const getPageTitle = (pathname: string): { title: string; arabic: string } => {
  if (pathname.startsWith('/records')) {
    return { title: 'Daily Records', arabic: 'سجل الأعمال' };
  }
  if (pathname.startsWith('/deeds')) {
    return { title: 'Deeds & Habits', arabic: 'الأعمال الصالحة' };
  }
  if (pathname.startsWith('/settings')) {
    return { title: 'Settings', arabic: 'الإعدادات' };
  }
  if (pathname.startsWith('/notifications')) {
    return { title: 'Notifications', arabic: 'التنبيهات' };
  }
  if (pathname.startsWith('/support')) {
    return { title: 'Guidance & Support', arabic: 'الإرشاد' };
  }
  return { title: 'Dashboard', arabic: 'لوحة المتابعة' };
};