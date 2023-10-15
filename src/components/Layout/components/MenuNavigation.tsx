/* eslint-disable max-len */
import { Box, Grid } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import Link from 'components/Link';
import Page from 'components/Page';
import Text from 'components/Text';
import React from 'react';
import styled, { css } from 'styled-components';
import { FacebookIcon, MediumIcon, RedditIcon, TelegramIcon, TwitterIcon } from 'svgs';
import { useRouter } from 'next/router';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import RoboLogo from 'components/Logo/RoboLogo';
import { urlRoute } from 'config/endpoints';
import { AutoColumn, Column } from '../Column';
import { menuConfigs } from './common';
import { RowCenter } from '../Row';

const ItemMenuNavigation = ({ active, href, title, Icon }) => {
  return (
    <StyledItemMenu $active={active} href={href}>
      <WrapIconButton p="4px">
        <Icon pathStroke={active && '#FFF'} />
      </WrapIconButton>
      <Text gradient={active ? '#FFF' : 'rgba(218, 218, 218, 0.8)'} color="textSubtle" scale="sm" fontWeight={600}>
        {title}
      </Text>
    </StyledItemMenu>
  );
};

const MenuNavigation: React.FC = () => {
  const router = useRouter();
  const { isTablet, isMobile } = useMatchBreakpoints();

  return (
    !isMobile &&
    !isTablet && (
      <StyledWrapper>
        <StyleContainer>
          <Page p={['12px', '', '20px']}>
            <RowCenter>
              <Link mt="16px" mb="40px" href={urlRoute.home().to}>
                <RoboLogo />
              </Link>
            </RowCenter>
            <AutoColumn gap="4px">
              {menuConfigs.map((menu) => {
                const { Icon, title } = menu;
                const to = menu?.route?.to || '';
                const path = menu?.route?.path || '';

                const isMatch = path === router.route;

                return (
                  <ItemMenuNavigation
                    key={`menu-navigation-${title}`}
                    Icon={Icon}
                    title={title}
                    href={to}
                    active={isMatch}
                  />
                );
              })}
            </AutoColumn>

            <Column mt="auto">
              <StyledWrapSocials>
                <Text fontSize="12px" color="textSubtle" mb="8px">
                  Our Communities
                </Text>
                <Grid gridTemplateColumns="repeat(5,1fr)">
                  <Link external href={urlRoute.twitter().to}>
                    <TwitterIcon size="24px" />
                  </Link>
                  <Link external href={urlRoute.telegram().to}>
                    <TelegramIcon size="24px" />
                  </Link>
                  <Link external href={urlRoute.facebook().to}>
                    <FacebookIcon size="24px" />
                  </Link>
                  <Link external href={urlRoute.reddit().to}>
                    <RedditIcon size="24px" />
                  </Link>
                  <Link external href={urlRoute.medium().to}>
                    <MediumIcon size="24px" />
                  </Link>
                </Grid>
              </StyledWrapSocials>
              <Text fontSize="12px" color="rgba(183, 189, 198, 0.6)">
                ver 1.0.1
              </Text>
            </Column>
          </Page>
        </StyleContainer>
      </StyledWrapper>
    )
  );
};

const StyledWrapper = styled(Box)`
  position: relative;
  box-sizing: border-box;
  display: none;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`;

export const MenuBlank = styled(Box)`
  position: relative;
  display: none;
  box-sizing: border-box;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
    width: ${({ theme }) => theme.menuWidth}px;
  }
`;

const StyleContainer = styled(MenuBlank)`
  width: ${({ theme }) => theme.menuWidth}px;
  height: calc(100vh - ${({ theme }) => theme.topbarHeight}px);
  margin-top: ${({ theme }) => theme.topbarHeight}px;

  background: ${({ theme }) => theme.colors.topbar};
  border-right: 1px solid ${({ theme }) => theme.colors.stroke};

  box-sizing: border-box;
  position: relative;

  display: flex;
  flex-direction: column;
`;

const StyledItemMenu = styled(Link)<{ $active: boolean }>`
  padding: 14px 16px;
  width: 100%;

  ${({ $active }) =>
    $active &&
    css`
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08)),
        linear-gradient(91.27deg, #0096f2 -1.47%, #0b0b0b 100%) !important;
    `}

  &:hover {
    background: #ffffff05;
  }

  border-radius: ${({ theme }) => theme.radius.small};
`;

const WrapIconButton = styled(IconButton)`
  margin-right: 16px;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const StyledWrapSocials = styled(Box)`
  padding: 12px 0;
  margin: 16px 0;

  border-color: ${({ theme }) => theme.colors.strokeSec};
  border-style: solid;

  border-top-width: 1px;
  border-bottom-width: 1px;
`;

export default MenuNavigation;
