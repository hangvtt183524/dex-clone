import { BoxProps } from 'components/Box/types';
import { HTMLAttributes } from 'react';
import RoboTheme from 'styles';
import { ShadowsVariant, ColorVariant, RadiusVariant } from 'styles/types';

export const scales = {
  LG: 'lg',
  MD: 'md',
  SM: 'sm',
  XS: 'xs',
} as const;

export const variants = {
  FORM: 'form',
  FORM_SECONDARY: 'form-secondary',
  PANEL: 'panel',
  MODAL: 'modal',
  TOOLIP: 'tooltip',
} as const;

export const scaleVariants = {
  [scales.MD]: {
    paddingSM: '24px',
    paddingDefault: '16px',
  },
  [scales.SM]: {
    paddingSM: '20px',
    paddingDefault: '12px',
  },
};

export const styleVariants = {
  [variants.FORM]: {
    background: RoboTheme.colors.form,
    backdropFilter: 'blur(40px)',
  },
  [variants.FORM_SECONDARY]: {
    background: RoboTheme.colors.formSecondary,
    backdropFilter: 'blur(40px)',
  },

  [variants.PANEL]: {
    background: RoboTheme.colors.panel,
  },
  [variants.MODAL]: {
    background: RoboTheme.colors.modal,
  },
  [variants.TOOLIP]: {
    background: RoboTheme.colors.tooltip,
  },
};

export interface CardProps extends HTMLAttributes<HTMLDivElement>, BoxProps {
  border?: string;
  background?: ColorVariant | string;
  isDisabled?: boolean;
  radius?: RadiusVariant | string;
  boxShadow?: ShadowsVariant | string;
  scale?: (typeof scales)[keyof typeof scales];
  variant?: (typeof variants)[keyof typeof variants];
}
