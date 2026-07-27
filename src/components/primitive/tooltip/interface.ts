import { Placement } from "@floating-ui/react";
import { ReactElement, ReactNode } from "react";

export interface TooltipProps {
  content: ReactNode;
  disabled?: boolean;
  placement?: Placement;
  children: ReactElement;
}