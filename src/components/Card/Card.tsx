import Box from 'components/Box/Box';
import React from 'react';
import styled from 'styled-components';
import { variant } from 'styled-system';
import { getBackgroundTheme, getRadiusTheme, getShadowTheme } from 'styles/utils';
import { CardProps, scales, scaleVariants, styleVariants } from './types';

const Card: React.FC<CardProps> = ({ children, scale = scales.SM, ...props }) => (
  <Wrapper scale={scale} {...props}>
    {children}
  </Wrapper>
);

const Wrapper = styled(Box)<CardProps>`
  overflow: hidden;
  border-radius: ${getRadiusTheme};
  box-shadow: ${({ boxShadow, theme }) => getShadowTheme({ shadow: boxShadow, theme })};
  padding: ${({ scale }) => scaleVariants[scale].paddingDefault};
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ scale }) => scaleVariants[scale].paddingSM};
  }

  ${variant({
    prop: 'variant',
    variants: styleVariants,
  })}

  background: ${getBackgroundTheme};
`;

Wrapper.defaultProps = {
  variant: 'form',
  radius: 'medium',
};

export default Card;
