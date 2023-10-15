import { Placement, Padding } from '@popperjs/core';
import { ColorVariant } from 'styles/types';

export interface TooltipRefs {
  targetRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  tooltip: React.ReactNode;
  tooltipVisible: boolean;
}

export interface TooltipOptions {
  placement?: Placement;
  trigger?: TriggerType;
  arrowPadding?: Padding;
  tooltipPadding?: Padding;
  tooltipOffset?: [number, number];

  maxWidth?: string;
  background?: ColorVariant | string;
}

export type TriggerType = 'click' | 'hover' | 'focus';
