import { RowCenter } from 'components/Layout/Row';
import React from 'react';
import styled from 'styled-components';
import { getRadiusTheme } from 'styles/utils';
import Card from './Card';
import { CardProps } from './types';

const CardBorderGradient: React.FC<CardProps> = ({ m, width = '100%', height = ' 100%', radius, ...props }) => (
  <Wrapper m={m} width={width} height={height} radius={radius}>
    <Card width="100%" height="100%" radius={radius} {...props} />
  </Wrapper>
);

const Wrapper = styled(RowCenter)<CardProps>`
  border: 0.8px solid transparent;
  border-radius: ${({ theme, radius }) => getRadiusTheme({ theme, radius }) || theme.radius.small};
  background: ${({ theme }) => theme.colors.gradients.primary};
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
`;

Wrapper.defaultProps = {
  variant: 'form',
  radius: 'medium',
};

export default CardBorderGradient;
