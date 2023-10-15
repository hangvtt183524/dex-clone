import { ElementType, ReactNode } from 'react';
import { LayoutProps, SpaceProps } from 'styled-system';
import { RadiusVariant, ColorVariant } from 'styles/types';
import { PolymorphicComponentProps } from 'utils/polymorphic';

export const variants = {
  PRIMARY: 'primary',
  DISABLED: 'disabled',
  MENU: 'menu',
  GROUP: 'group',
  GROUPACTIVE: 'group-active',
  DANGER: 'danger',
  ICONBUTTON: 'icon-button',
} as const;

export const scales = {
  XL: 'xl',
  LG: 'lg',
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
} as const;

export type Variant = (typeof variants)[keyof typeof variants];
export type Scale = (typeof scales)[keyof typeof scales];

export interface BaseButtonProps extends LayoutProps, SpaceProps {
  as?: 'a' | 'button' | ElementType;
  external?: boolean;
  isLoading?: boolean;
  variant?: Variant;
  scale?: Scale;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  radius?: RadiusVariant | string;
  background?: ColorVariant | string;
  color?: ColorVariant;
}

export type ButtonProps<P extends ElementType = 'button'> = PolymorphicComponentProps<P, BaseButtonProps> & {
  ref?: any;
};
