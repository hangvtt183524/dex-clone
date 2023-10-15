import { BoxProps } from 'components/Box';
import React from 'react';

export type LayoutProps = BoxProps & {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundOpacity?: number;
};
