import Text from 'components/Text';
import useAutoRouterSupported from 'hooks/useAutoRouterSupported';
import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components/macro';
import { SwapIcon } from 'svgs';
import AutoRouterIcon from './AutoRouterIcon';

const StyledAutoRouterIcon = styled(AutoRouterIcon)`
  height: 16px;
  width: 16px;

  :hover {
    filter: brightness(1.3);
  }
`;

const StyledStaticRouterIcon = styled(SwapIcon)`
  height: 16px;
  width: 16px;

  fill: ${({ theme }) => theme.colors.stroke};

  :hover {
    filter: brightness(1.3);
  }
`;

const StyledAutoRouterLabel = styled(Text)`
  line-height: 1rem;

  /* fallback color */
  color: ${({ theme }) => theme.colors.textSubtle};

  @supports (-webkit-background-clip: text) and (-webkit-text-fill-color: transparent) {
    background-image: linear-gradient(90deg, #2172e5 0%, #54e521 163.16%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const AutoRouterLogo = () => {
  const autoRouterSupported = useAutoRouterSupported();

  return autoRouterSupported ? <StyledAutoRouterIcon /> : <StyledStaticRouterIcon />;
};

export const AutoRouterLabel = () => {
  const autoRouterSupported = useAutoRouterSupported();

  return autoRouterSupported ? (
    <StyledAutoRouterLabel fontSize="14">Auto Router</StyledAutoRouterLabel>
  ) : (
    <Text fontSize="14">
      <Trans>Trade Route</Trans>
    </Text>
  );
};
