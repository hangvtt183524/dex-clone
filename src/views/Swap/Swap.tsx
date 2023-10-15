import { Box, Grid } from 'components/Box';
import React from 'react';
import styled from 'styled-components';
import Page from 'components/Page';
import RoboTheme from 'styles';
import PairDataContextProvider from 'subgraph/contexts/PairData';
import TokenDataContextProvider from 'subgraph/contexts/TokenData';
import ApplicationContextProvider from 'subgraph/contexts/Application';
import SwapConfig from './components/SwapConfig';
import SwapForm from './components/SwapForm';
import SwapChart from './components/SwapChart';

const Swap: React.FC = () => {
  return (
    <Page overflowX="hidden" maxWidth={RoboTheme.siteWidth} mx="auto" p={['12px', '12px 16px', '20px 24px', '40px']}>
      <SwapConfig />
      <ApplicationContextProvider>
        <PairDataContextProvider>
          <TokenDataContextProvider>
            <StyledContainer>
              <SwapForm />
              <StyledWrapChart>
                <SwapChart />
              </StyledWrapChart>
            </StyledContainer>
          </TokenDataContextProvider>
        </PairDataContextProvider>
      </ApplicationContextProvider>
    </Page>
  );
};

const StyledContainer = styled(Grid)`
  max-width: ${({ theme }) => theme.siteWidth}px;
  width: 100%;
  overflow-x: hidden;

  grid-template-columns: 1fr;
  grid-gap: 32px;
  position: relative;
  z-index: 1;
  justify-content: center;
  align-items: flex-start;

  ${({ theme }) => theme.mediaQueries.xxl} {
    grid-gap: 16px;
    grid-template-columns: 1.4fr 2fr;
  }
`;

const StyledWrapChart = styled(Box)`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  max-width: 750px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    max-width: 100%;
  }
`;

export default Swap;
