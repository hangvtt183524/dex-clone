import React from 'react';
import styled from 'styled-components';

import Flex from 'components/Box/Flex';

import Page from 'components/Page';
import Topbar from './Topbar';
import { LayoutProps } from './types';
import { Column } from './Column';
import BottomBar from './BottomBar';
import MenuNavigation, { MenuBlank } from './components/MenuNavigation';

const Layout: React.FC<LayoutProps> = ({ children, backgroundImage, backgroundOpacity, ...props }) => (
  <Wrapper>
    <WrapPage>
      <Column position="fixed" top="0" zIndex={100}>
        <Topbar />
        <MenuNavigation />
      </Column>
      <WrapPageContainer>
        <MenuBlank />
        <StyledContent backgroundOpacity={backgroundOpacity} backgroundImage={backgroundImage} {...props}>
          {children}
        </StyledContent>
      </WrapPageContainer>
      <BottomBar />
    </WrapPage>
  </Wrapper>
);

const Wrapper = styled(Flex)`
  width: 100vw;
  min-height: 100vh;
`;

const WrapPage = styled(Column)`
  width: 100%;
  min-height: 100%;

  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
`;

const WrapPageContainer = styled(Flex)`
  width: 100%;
  flex: 1;
  min-height: 100%;

  box-sizing: border-box;

  margin: 0 auto;
  padding-bottom: ${({ theme }) => theme.bottombarHeight}px;
  padding-top: ${({ theme }) => theme.topbarHeight}px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-bottom: 0;
  }
`;

const StyledContent = styled(Page)<{ backgroundOpacity?: number }>`
  flex: 1;
  padding-top: 24px;
  padding-bottom: 24px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;

  ::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    background-image: ${({ backgroundImage }) => ` url('/assets/images/${backgroundImage}')`};
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    background-position: 0 ${({ theme }) => theme.topbarHeight}px;
    opacity: ${({ backgroundOpacity }) => backgroundOpacity};

    ${({ theme }) => theme.mediaQueries.lg} {
      background-position: ${({ theme }) => theme.menuWidth}px ${({ theme }) => theme.topbarHeight}px;
    }
  }
  opacity: 1;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 40px;
  }
`;
export default Layout;
