import { InputHTMLAttributes } from 'react';
import { Colors, Gradients } from 'styles/types';

export const scales = {
  MD: 'md',
  LG: 'lg',
} as const;

export type Scales = (typeof scales)[keyof typeof scales];

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
  scale?: Scales;
  checked?: boolean;
  value?: boolean;
  checkedColor?: keyof Colors;
  defaultColor?: keyof Colors;
  onChange?: (boolean) => void;
}

export interface HandleProps {
  scale: Scales;
  $checked: boolean;
}

export interface InputProps {
  scale: Scales;
}

export interface StyleToggleProps {
  $checked: boolean;
  $checkedColor: keyof Gradients;
  $defaultColor: keyof Gradients;
  scale: Scales;
}

export const scaleKeys = {
  handleHeight: 'handleHeight',
  handleWidth: 'handleWidth',
  handleLeft: 'handleLeft',
  handleTop: 'handleTop',
  checkedLeft: 'checkedLeft',
  toggleHeight: 'toggleHeight',
  toggleWidth: 'toggleWidth',
} as const;

export type ScaleKeys = (typeof scaleKeys)[keyof typeof scaleKeys];
