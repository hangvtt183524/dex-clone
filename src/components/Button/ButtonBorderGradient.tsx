import React, { ElementType } from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import RoboTheme from 'styles';
import { getThemeValue } from 'styles/utils';
import { Scale } from 'components/Button/types';
import BoxGradient from 'components/Box/BoxGradient';
import Button from './Button';
import { scaleVariants } from './themeButton';
import { ButtonProps } from './types';

const Wrapper = styled(BoxGradient)<{ scale: Scale }>`
  ${variant({
    prop: 'scale',
    variants: scaleVariants,
  })}
`;
const ButtonBorderGradient = <E extends ElementType = 'button'>(
  {
    width = 'max-content',
    height = '42px',
    radius,
    background = 'form',
    onClick,
    children,
    p,
    style,
    scale,
    ...props
  }: Omit<ButtonProps<E>, 'ref'>,
  ref,
) => {
  return (
    <Wrapper radius={radius} width={width} height={height} scale={scale} {...props}>
      <Button
        background={background ? `${getThemeValue(`colors.${background}`, background)(RoboTheme)} !important` : ''}
        radius={radius}
        height="100% !important"
        width="100% !important"
        onClick={onClick}
        p={p}
        scale={scale}
        style={style}
        ref={ref}
      >
        {children}
      </Button>
    </Wrapper>
  );
};

export default React.forwardRef(ButtonBorderGradient);
