'use client';

import styles from './tooltip.module.css';
import { TooltipProps } from './interface';
import { cloneElement, isValidElement, useState } from 'react';
import { offset, flip, shift, useFloating, useHover, useFocus, useDismiss, useRole, useInteractions, autoUpdate } from '@floating-ui/react';

export default function Tooltip({ children, content, placement = 'top', disabled = false }: TooltipProps) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [ offset(8), flip(), shift({ padding: 8 }) ]
  });

  const hover = useHover(context, { move: false, enabled: !disabled });

  const focus = useFocus(context, { enabled: !disabled });

  const dismiss = useDismiss(context);

  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([ hover, focus, dismiss, role ]);

  if (!isValidElement(children)) return null;

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref: refs.setReference, ...(children.props as object) }))}

      {open && content && !disabled && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={styles.tooltip}
          {...getFloatingProps()}
        >
          {content}
        </div>
      )}
    </>
  );
}