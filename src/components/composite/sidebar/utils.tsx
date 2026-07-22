import { BiSupport } from 'react-icons/bi';
import { FaNoteSticky } from 'react-icons/fa6';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { PLACEHOLDERS } from '@/constants/placeholders';
import { FaFolderOpen, FaComment } from 'react-icons/fa';

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
    logo: <BsFillGrid3X3GapFill size={22} />
  },
  {
    text: SIDEBAR_LI_RECORDS,
    href: SIDEBAR_LI_HREF_RECORDS,
    logo: <FaNoteSticky size={22}/>
  },
  {
    text: SIDEBAR_LI_DEEDS,
    href: SIDEBAR_LI_HREF_DEEDS,
    logo: <FaFolderOpen size={24}/>
  },
  {
    logo: <FaComment size={20}/>,
    text: SIDEBAR_LI_NOTIFICATIONS,
    href: SIDEBAR_LI_HREF_NOTIFICATIONS
  },
  {
    text: SIDEBAR_LI_SUPPORT,
    logo: <BiSupport size={24}/>,
    href: SIDEBAR_LI_HREF_SUPPORT
  }
];

export const isActiveLocation = (location: string, href: string, styles: any) => {
  if (!location.includes(href)) return '';
  return styles.is__active__location;
};