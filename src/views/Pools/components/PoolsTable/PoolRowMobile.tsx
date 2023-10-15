import { Flex, Box, Grid } from 'components/Box';
import Button from 'components/Button';
import IconButton from 'components/Button/IconButton';
import IconButtonStatus from 'components/Button/IconButtonStatus';
import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowFixed, RowMiddle } from 'components/Layout/Row';
import LinkExternal from 'components/Link/LinkExternal';
import { NextLinkFromReactRouter } from 'components/Link/NextLink';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import QuestionHelper from 'components/QuestionHelper';
import Text from 'components/Text';
import { urlRoute } from 'config/endpoints';
import { CHAIN_ID } from 'config/env';
import { explainField } from 'config/explain';
import { ROBO } from 'config/tokens';
import React, { useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import RoboTheme from 'styles';
import { Dots } from 'styles/common';
import { DownIcon, CalculatorIcon } from 'svgs';
import { getAddressCurrency } from 'utils/addressHelpers';
import { copyContent } from 'utils/copy';
import { unwrappedToken } from 'utils/wrappedCurrency';
import { PositionCardProps } from './types';

const FarmRowMobile: React.FC<PositionCardProps> = ({ pair, ...props }) => {
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => setToggle(!toggle);

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const urlLink = useMemo(
    () =>
      urlRoute.addLiquidity({
        inputCurrency: getAddressCurrency(currency0),
        outputCurrency: getAddressCurrency(currency1),
      }).to,
    [currency0, currency1],
  );

  return (
    <Wrapper {...props}>
      <StyledTrButton expanded={toggle} onClick={handleToggle}>
        <RowFixed>
          <Flex>
            <RowMiddle flex={0}>
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={28} />
            </RowMiddle>
            <LinkExternal color="textSubtle">
              <Text mr="8px" fontSize={['12px', '14px']} color="text">
                {!currency0 || !currency1 ? (
                  <Dots>
                    <span>Loading</span>
                  </Dots>
                ) : (
                  `${currency0.symbol}-${currency1.symbol}`
                )}
              </Text>
            </LinkExternal>
          </Flex>
        </RowFixed>
        <RowFixed position="relative">
          <Text fontSize="14px" color="textSubtle" mr="8px">
            APR:
          </Text>
          <Text fontSize="14px" color="mark" mr="12px">
            60%
          </Text>

          <IconButton
            position="absolute"
            right="24px"
            style={{
              transition: RoboTheme.transitions.fast,
              transform: `rotate(${toggle ? 180 : 0}deg)`,
            }}
          >
            <DownIcon />
          </IconButton>
        </RowFixed>
      </StyledTrButton>

      <StyledWrapMoreInfo expanded={toggle}>
        <WrapDetailInfoFarm gap="12px">
          <RowBetween>
            <StyledTitleDetail>APR:</StyledTitleDetail>
            <RowFixed>
              <Text color="mark">60%</Text>
              <RowFixed pl="8px">
                <QuestionHelper text="apr" />
                <IconButton ml="6px">
                  <CalculatorIcon />
                </IconButton>
              </RowFixed>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <StyledTitleDetail>Stake TVL:</StyledTitleDetail>
            <RowFixed>
              <Text>$371.42K</Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <StyledTitleDetail>Rewards/day:</StyledTitleDetail>
            <RowFixed>
              <Text>$524.42</Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <StyledTitleDetail>Earning:</StyledTitleDetail>
            <RowFixed>
              <CurrencyLogo currency={ROBO[CHAIN_ID]} />
              <Text ml="4px">0 RBIF</Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <StyledTitleDetail mr="4px">Ended:</StyledTitleDetail>
              <QuestionHelper text={explainField.endingIn} />
            </RowFixed>
            <RowFixed>
              <Text>25D 10H 23M</Text>
            </RowFixed>
          </RowBetween>
        </WrapDetailInfoFarm>
        <WrappFarmEvent>
          <Button as={NextLinkFromReactRouter} href={urlLink} height="42px">
            Add Liquidity
          </Button>

          <IconButtonStatus
            onClick={() => copyContent(window.location.origin + urlLink)}
            p="0 !important"
            width="100% !important"
            height="100% !important"
            transparent
          >
            <Text fontSize="14px" fontWeight={600} gradient={RoboTheme.colors.gradients.primary}>
              Share
            </Text>
          </IconButtonStatus>
        </WrappFarmEvent>
      </StyledWrapMoreInfo>
    </Wrapper>
  );
};

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 316px;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 316px;
  }
  to {
    max-height: 0px;
  }
`;

const Wrapper = styled(Box)`
  background: ${({ theme }) => theme.colors.inputQuaternary};
  border-radius: ${({ theme }) => theme.radius.small};
`;

const StyledWrapMoreInfo = styled(Box)<{ expanded: boolean }>`
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  padding: 0 8px;

  ${({ expanded }) =>
    expanded
      ? css`
          animation: ${expandAnimation} 300ms linear forwards;
        `
      : css`
          animation: ${collapseAnimation} 300ms linear forwards;
        `}
`;

const WrapDetailInfoFarm = styled(AutoColumn)`
  border: 1px solid ${({ theme }) => theme.colors.strokeSec};
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.small};
`;
const WrappFarmEvent = styled(Grid)`
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;

  .token-amount-input {
    background: #323342;
    input {
      background: #323342;
    }
  }
`;

const StyledTrButton = styled(RowBetween)<{ expanded?: boolean }>`
  cursor: pointer;
  height: 60px;
  position: relative;
  z-index: 1;
  border-radius: ${({ theme }) => theme.radius.small};
  padding: 12px 16px;
`;

const StyledTitleDetail = styled(Text).attrs({
  color: 'textAlt3',
  fontSize: '14px',
  fontWeight: 400,
})``;

export default FarmRowMobile;
