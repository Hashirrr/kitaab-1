import styles from './hamburger.module.css';
import { HamburgerProps } from './interface';
import { PLACEHOLDERS } from '@/constants/placeholders';

export default function Hamburger({ isOpen, onToggle }: HamburgerProps) {

  const { HAMBURGER_BTN_ARIA_LABEL } = PLACEHOLDERS;
  return (
    <button
      aria-expanded={isOpen}
      onClick={() => onToggle?.(!isOpen)}
      aria-label={HAMBURGER_BTN_ARIA_LABEL}
      className={`${styles.hamburger} ${isOpen ? styles.open: ''}`}
    >
      <span />
      <span />
      <span />
    </button>
  );
}