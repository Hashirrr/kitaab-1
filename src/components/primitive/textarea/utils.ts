import { Overflow } from "@/constants/enums";

export const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const textarea = e.currentTarget;

  textarea.style.height = '0px';

  const styles = getComputedStyle(textarea);

  const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.2;

  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingBottom = parseFloat(styles.paddingBottom) || 0;

  const maxHeight = lineHeight * 4 + paddingTop + paddingBottom;

  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;

  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? Overflow.auto : Overflow.hidden;
};