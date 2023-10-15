import { Box, BoxProps } from 'components/Box';
import React from 'react';
import styled, { css } from 'styled-components';
import { themeKeyframes } from 'styles/keyframes';
import { CircleLoaderIcon } from 'svgs';

const SpinnerCss = css`
  animation: 2s ${themeKeyframes.loading} linear infinite;
`;
const Spinner = styled(Box)`
  svg {
    ${SpinnerCss}

    width: ${({ width, size }) => size || width || '80px'};
    height: ${({ height, size }) => size || height || '80px'};
  }
`;

const CircleLoader: React.FC<
  BoxProps & {
    size?: number | string;
  }
> = ({ ...props }) => {
  return (
    <Spinner {...props}>
      <CircleLoaderIcon />
    </Spinner>
  );
};

export default CircleLoader;
