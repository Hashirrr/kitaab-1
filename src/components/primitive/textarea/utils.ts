import { Overflow } from "@/constants/enums";

export const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
  const textarea = e.currentTarget;

  textarea.style.height = '0px';

  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
  const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop);
  const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom);

  const maxHeight = lineHeight * 4 + paddingTop + paddingBottom;

  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  textarea.style.overflowY =
  textarea.scrollHeight > maxHeight ? Overflow.auto : Overflow.hidden;
};