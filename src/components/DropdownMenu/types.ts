import { Placement } from '@popperjs/core';
import React from 'react';
import { BoxProps } from '../Box';

export interface DropdownMenuProps extends BoxProps {
  content: React.ReactNode;
  placement?: Placement;
  trigger?: 'hover' | 'click';
  isDisabled?: boolean;
  /**
   * As BottomNav styles
   */
  isBottomNav?: boolean;
  /**
   * Show items on mobile when `isBottomNav` is true
   */
  index?: number;
  maxWidthContent?: number;
  setMenuOpenByIndex?: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;

  showItemsOnMobile?: boolean;
}
