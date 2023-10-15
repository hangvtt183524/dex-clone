import { TextProps } from 'components/Text/types';
import { ElementType } from 'react';
import { DefaultTheme } from 'styled-components';
import { SpaceProps } from 'styled-system';
import { PolymorphicComponentProps } from 'utils/polymorphic';

export const scales = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export const variants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  QUATERNARY: 'quaternary',
  TOOLTIP: 'tooltip',
  TRANSPARENT: 'transparent',
  SELECT: 'select',
} as const;

export type Scales = (typeof scales)[keyof typeof scales];
export type Variant = (typeof variants)[keyof typeof variants];

export type InputBaseProps = SpaceProps &
  TextProps & {
    scale?: Scales;
    align?: 'left' | 'right';
    isSuccess?: boolean;
    isWarning?: boolean;
    variant?: Variant;
  };

export type InputProps<P extends ElementType = 'input'> = PolymorphicComponentProps<P, InputBaseProps>;
export interface ThemedInputProps extends InputProps {
  theme: DefaultTheme;
}
