import RoboTheme from 'styles';
import colors from 'styles/colors';
import { scales, variants } from './types';

export const styleVariants = {
  [variants.PRIMARY]: {
    background: colors.gradients.primary,
    color: 'text',
    fontWeight: 600,
  },
  [variants.DISABLED]: {
    background: colors.buttonDisabled,
    color: 'textDisabled',
    border: `1px solid ${RoboTheme.colors.stroke}`,
  },
  [variants.MENU]: {
    background: colors.buttonMenu,
    color: 'textSubtle',
  },
  [variants.GROUP]: {
    background: colors.buttonGroup,
    color: 'textSubtle',
    fontSize: ['14px !important'],
  },
  [variants.GROUPACTIVE]: {
    background: colors.buttonGroupActive,
    color: 'text',
    fontSize: ['14px !important'],
  },
  [variants.DANGER]: {
    background: colors.failure,
    color: 'white',
  },
  [variants.ICONBUTTON]: {
    background: colors.backgroundAlt,
  },
};

export const scaleVariants = {
  [scales.XL]: {
    height: '56px',
    padding: '0 24px',
    fontSize: '16px',
    lineHeight: '20px',
  },
  [scales.LG]: {
    height: '48px',
    padding: '0 24px',
    fontSize: '16px',
    lineHeight: '20px',
  },
  [scales.MD]: {
    height: '42px',
    padding: '0 14px',
    fontSize: '14px',
    lineHeight: '18px',
  },
  [scales.SM]: {
    height: '38px',
    padding: '0 14px',
    fontSize: '14px',
    lineHeight: '18px',
  },
  [scales.XS]: {
    height: '32px',
    fontSize: '12px',
    padding: '0 8px',
    lineHeight: '16px',
  },
};
