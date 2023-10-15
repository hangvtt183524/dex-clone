import { RowCenter } from 'components/Layout/Row';
import React from 'react';
import styled from 'styled-components';
import { ColorVariant, RadiusVariant } from 'styles/types';
import { getRadiusTheme } from 'styles/utils';
import Box from './Box';
import { BoxProps } from './types';

const BoxGradient: React.FC<BoxProps & { radius?: RadiusVariant | string; background?: ColorVariant | string }> = ({
  background,
  children,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <Box width="inherit" height="inherit" background={background}>
        {children}
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(RowCenter)<{ radius?: RadiusVariant | string }>`
  border-radius: ${({ theme, radius }) => getRadiusTheme({ theme, radius }) || theme.radius.small};
  background: ${({ theme }) => theme.colors.gradients.primary};
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;

  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'fit-content'};
  padding: 1px !important;
  box-sizing: content-box;
`;
export default BoxGradient;
