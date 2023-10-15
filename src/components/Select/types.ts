import { BoxProps } from 'components/Box';
import { RadiusVariant } from 'styles/types';

export const scales = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export const variants = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export type Scales = (typeof scales)[keyof typeof scales];
export type SelectVariant = (typeof variants)[keyof typeof variants];

export interface OptionProps {
  label: string;
  value: any;
}

export interface SelectStyledProps {
  variant?: SelectVariant;
  radius?: RadiusVariant;
}

export interface SelectProps extends BoxProps, SelectStyledProps {
  options: OptionProps[];
  onOptionChange?: (option: OptionProps) => void;
  placeHolderText?: string;
  defaultOptionIndex?: number;
}
