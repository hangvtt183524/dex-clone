import styled from 'styled-components';
import { space, typography, variant } from 'styled-system';
import RoboTheme from 'styles';
import { getThemeValue } from 'styles/utils';
import { InputProps, ThemedInputProps, scales, variants } from './types';

const getHeight = ({ scale = scales.MD }: InputProps) => {
  switch (scale) {
    case scales.SM:
      return '32px';
    case scales.LG:
      return '48px';
    case scales.MD:
    default:
      return '40px';
  }
};

const getColor = ({ theme, color }: ThemedInputProps) =>
  getThemeValue(`colors.${color}`, color || theme.colors.textSubtle)(theme);

export const styleInputVariants = {
  [variants.PRIMARY]: {
    background: RoboTheme.colors.inputPrimary,
  },
  [variants.SECONDARY]: {
    background: RoboTheme.colors.inputSecondary,
  },
  [variants.TERTIARY]: {
    background: RoboTheme.colors.inputTertiary,
  },
  [variants.QUATERNARY]: {
    background: RoboTheme.colors.inputQuaternary,
  },
  [variants.TOOLTIP]: {
    background: RoboTheme.colors.tooltip,
  },
  [variants.SELECT]: {
    background: RoboTheme.colors.select,
  },
  [variants.TRANSPARENT]: {
    background: 'transparent',
  },
};

const Input = styled.input<InputProps>`
  display: block;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '100%'};

  max-width: ${({ maxWidth }) => maxWidth || '100%'};
  max-height: ${({ maxHeight }) => maxHeight || '100%'};

  text-align: ${({ align }) => align ?? 'left'};
  height: ${getHeight};
  color: ${getColor};
  outline: none;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.small};
  border: 0;
  box-sizing: border-box;
  transition: 0.5s all;

  &::placeholder {
    color: rgba(255,255,255,0.3);
  }

  font-size: ${({ fontSize }) => fontSize ?? '14px'};
  line-height: 20px;

  ${variant({
    prop: 'variant',
    variants: styleInputVariants,
  })}

  ${space}
  ${typography}
`;

Input.defaultProps = {
  variant: 'primary',
};

export default Input;
