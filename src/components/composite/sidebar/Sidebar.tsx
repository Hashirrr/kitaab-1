'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { sidebarItems } from './utils';
import SidebarItem from './SidebarItem';
import { FaGear } from 'react-icons/fa6';
import styles from './sidebar.module.css';
import { HeaderProps } from './interface';
import logoNormal from '@/assets/logo.png';
import logoHover from '@/assets/logo-hover.png';
import { useIsMobile } from '@/store/slices/utils';
import logoNormalDark from '@/assets/logo-dark.png';
import { PLACEHOLDERS } from '@/constants/placeholders';
import logoHoverDark from '@/assets/logo-hover-dark.png';
import { setSidebarExpanded } from '@/store/slices/uiSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectSidebarExpanded } from '@/store/slices/selectors';
import Hamburger from '@/components/primitive/hamburger/Hamburger';
import Draggables from '@/components/composite/draggables/Draggables';

const Header = ({ alt }: HeaderProps) => {
  return (
    <header>
      <div className={styles.logo__light}>
        <Image
          priority
          alt={alt}
          width={60}
          src={logoNormal}
          className={styles.logo__normal}
        />
        <Image
          priority
          alt={alt}
          width={60}
          src={logoHover}
          className={styles.logo__hover}
        />
      </div>

      <div className={styles.logo__dark}>
        <Image
          priority
          alt={alt}
          width={60}
          src={logoNormalDark}
          className={styles.logo__normal}
        />
        <Image
          priority
          alt={alt}
          width={60}
          src={logoHoverDark}
          className={styles.logo__hover}
        />
      </div>
    </header>
  )
};

export default function Sidebar() {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const sidebarExpanded = useAppSelector(selectSidebarExpanded);
  const {
    KITAAB_LOGO_ALT,
    SIDEBAR_BTN_SETTINGS,
    SIDEBAR_NAV_ARIA_LABEL,
    SIDEBAR_BTN_HREF_SETTINGS,
  } = PLACEHOLDERS;

  return (
    <>
      {sidebarExpanded && 
        <div className={styles.backdrop} onClick={() => dispatch(setSidebarExpanded(false))} />
      }
      {isMobile && <Hamburger
        isOpen={sidebarExpanded}
        onToggle={(isOpen) => dispatch(setSidebarExpanded(isOpen))}
      />}
      {isMobile && <div className={styles.topbar}>
        <Header alt={KITAAB_LOGO_ALT}/>
      </div>}
      
      <aside className={clsx(
        styles.aside, 
        sidebarExpanded ? styles.is__sidebar__expanded: styles.is__sidebar__collapsed
      )}>
        {!isMobile? <Header alt={KITAAB_LOGO_ALT}/>: <div/>}
        <nav aria-label={SIDEBAR_NAV_ARIA_LABEL} className={styles.nav} >
          <ul className={styles.list}>
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <SidebarItem
                  text={item.text}
                  logo={item.logo}
                  href={item.href}
                />
              </li>
            ))}
          </ul>
        </nav>

        <footer className={styles.footer}>
          <SidebarItem
            logo={<FaGear size={24} />}
            text={SIDEBAR_BTN_SETTINGS}
            href={SIDEBAR_BTN_HREF_SETTINGS}
          />
        </footer>
      </aside>
      <Draggables/>
    </>
  );
}