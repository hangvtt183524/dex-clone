import { LayoutProps, SpaceProps, TypographyProps } from 'styled-system';
import { ColorVariant } from 'styles/types';

export const textScales = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',
} as const;

export type Scales = (typeof textScales)[keyof typeof textScales];

export interface TextProps extends SpaceProps, TypographyProps, LayoutProps {
  color?: ColorVariant | string;
  fontSize?: string | string[];
  bold?: boolean;
  ellipsis?: number;
  scale?: Scales;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  gradient?: string;
  whiteSpace?: 'nowrap' | 'break-spaces' | 'normal';
  small?: boolean;
}
