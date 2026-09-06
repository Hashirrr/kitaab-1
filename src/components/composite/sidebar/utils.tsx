import { LuLayoutDashboard, LuCalendarCheck2, LuSparkles, LuBell, LuCompass } from 'react-icons/lu';
import styles from './sidebaritem.module.css';
import { PLACEHOLDERS } from '@/constants/placeholders';

const {
  SIDEBAR_LI_DEEDS,
  SIDEBAR_LI_RECORDS,
  SIDEBAR_LI_SUPPORT,
  SIDEBAR_LI_DASHBOARD,
  SIDEBAR_LI_HREF_DEEDS,
  SIDEBAR_LI_HREF_RECORDS,
  SIDEBAR_LI_HREF_SUPPORT,
  SIDEBAR_LI_NOTIFICATIONS,
  SIDEBAR_LI_HREF_DASHBOARD,
  SIDEBAR_LI_HREF_NOTIFICATIONS
} = PLACEHOLDERS;

export const sidebarItems = [
  {
    text: SIDEBAR_LI_DASHBOARD,
    href: SIDEBAR_LI_HREF_DASHBOARD,
    logo: <LuLayoutDashboard size={20} />
  },
  {
    text: SIDEBAR_LI_RECORDS,
    href: SIDEBAR_LI_HREF_RECORDS,
    logo: <LuCalendarCheck2 size={20} />
  },
  {
    text: SIDEBAR_LI_DEEDS,
    href: SIDEBAR_LI_HREF_DEEDS,
    logo: <LuSparkles size={20} />
  },
  {
    logo: <LuBell size={20} />,
    text: SIDEBAR_LI_NOTIFICATIONS,
    href: SIDEBAR_LI_HREF_NOTIFICATIONS
  },
  {
    text: SIDEBAR_LI_SUPPORT,
    logo: <LuCompass size={20} />,
    href: SIDEBAR_LI_HREF_SUPPORT
  }
];

export const isActiveLocation = (location: string, href: string) => {
  if (!location.includes(href)) return '';
  return styles.is__active__location;
};