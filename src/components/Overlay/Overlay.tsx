import styled from 'styled-components';
import React, { FC, useEffect } from 'react';

import Box from 'components/Box/Box';
import { BoxProps } from 'components/Box/types';

const StyledOverlay = styled(Box)`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);

  z-index: 20;
`;

export const BoxOverLay = styled(StyledOverlay)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const BodyLock = () => {
  useEffect(() => {
    document.body.style.cssText = `
      overflow: hidden;
    `;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.cssText = `
        overflow: visible;
        overflow: overlay;
      `;
    };
  }, []);

  return null;
};

export const Overlay: FC<BoxProps> = (props) => (
  <>
    <BodyLock />
    <StyledOverlay role="presentation" {...props} />
  </>
);

export default Overlay;
