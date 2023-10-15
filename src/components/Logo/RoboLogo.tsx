import { Box } from 'components/Box';
import Image from 'components/Image';
import React from 'react';
import styled from 'styled-components';

export const ROBO_LOGO_URL = 'https://assets.coingecko.com/coins/images/20821/small/O68Gs5SE_400x400.jpg?1654929220';

const RoboLogo = () => {
  return (
    <Wrapper minWidth="90px">
      <Image className="desktop" width={173} height={24} src="/assets/images/logo-robo-full.svg" alt="logo-robo" />
      <Image className="mobile" width={97} height={24} src="/assets/images/logo-robo-short.svg" alt="logo-robo" />
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  .desktop {
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    .desktop {
      display: block;
    }
    .mobile {
      display: none;
    }
  }
`;

export default RoboLogo;
