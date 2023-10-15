import styled, { DefaultTheme } from 'styled-components';
import { space, layout, variant } from 'styled-system';
import { getBackgroundTheme, getColorTheme, getRadiusTheme } from 'styles/utils';
import { scaleVariants, styleVariants } from './themeButton';
import { BaseButtonProps } from './types';

interface ThemedButtonProps extends BaseButtonProps {
  theme: DefaultTheme;
}

interface TransientButtonProps extends ThemedButtonProps {
  $isLoading?: boolean;
}

const getDisabledStyles = ({ $isLoading, theme }: TransientButtonProps) => {
  if ($isLoading === true) {
    return `
      &:disabled,
      &.button--disabled {
        cursor: not-allowed;
      }
    `;
  }

  return `
    &:disabled,
    &.button--disabled {
      background:  ${theme.colors.gradients.disabled};
      border: 2px solid ${theme.colors.stroke};
      box-shadow: none;
      color:  ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `;
};
const getColor = ({ color, theme }: ThemedButtonProps) => getColorTheme({ color, theme }) || '#FFFFFF';

const getBackground = ({ background, theme }: ThemedButtonProps) => getBackgroundTheme({ background, theme }) || '';

const getOpacity = ({ $isLoading = false }: TransientButtonProps) => ($isLoading ? '.5' : '1');

const StyledButton = styled.button<BaseButtonProps>`
  align-items: center;
  border: 0;
  color: ${getColor};
  border-radius: ${getRadiusTheme};

  cursor: pointer;
  display: inline-flex;
  height: ${({ height }) => height || '34px'};
  justify-content: center;
  letter-spacing: 0.03em;
  padding: 4px 12px;
  line-height: 1;
  opacity: ${getOpacity};
  outline: 0;
  transition: opacity 0.2s;
  font-weight: 500;
  font-size: 14px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }

  &:hover:not(:disabled):not(.button--disabled):not(.button--disabled):not(:active) {
    opacity: 1;
    filter: brightness(1.05);
  }

  &:active:not(:disabled):not(.button--disabled):not(.button--disabled) {
    opacity: 0.75;
    filter: brightness(0.9);
  }

  ${variant({
    prop: 'scale',
    variants: scaleVariants,
  })}
  ${variant({
    prop: 'variant',
    variants: styleVariants,
  })}
  
  ${getDisabledStyles}
  background: ${getBackground};

  ${layout}
  ${space}
`;

export default StyledButton;
