import { Box } from 'components/Box';
import Button from 'components/Button';
import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
import IconButtonStatus from 'components/Button/IconButtonStatus';
import CopyToClipboard from 'components/CopyToClipboard';
import { RowCenter, RowFixed, RowMiddle } from 'components/Layout/Row';
import { NextLinkFromReactRouter } from 'components/Link/NextLink';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import QuestionHelper from 'components/QuestionHelper';
import { Td, Tr } from 'components/Table/Cell';
import Text from 'components/Text';
import { urlRoute } from 'config/endpoints';
import useTooltip from 'hooks/useTooltip';
import React from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { Dots } from 'styles/common';
import { PlusIcon, ShareSecondaryIcon } from 'svgs';
import { truncateHash } from 'utils/addressHelpers';
import { copyContent } from 'utils/copy';
import { unwrappedToken } from 'utils/wrappedCurrency';
import { PositionCardProps } from './types';

const PoolRowDesktop: React.FC<
  PositionCardProps & {
    hideTLV?: boolean;
    hideFee?: boolean;
    hideVolume?: boolean;
  }
> = ({
  pair,
  //  stakedBalance,
  hideTLV,
  hideFee,
  hideVolume,
}) => {
  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const {
    targetRef: targetRefAdd,
    tooltip: tooltipAdd,
    tooltipVisible: tooltipVisibleAdd,
  } = useTooltip('Add Liquidity', { placement: 'left-end', trigger: 'hover' });

  const {
    targetRef: targetRefShare,
    tooltip: tooltipShare,
    tooltipVisible: tooltipVisibleShare,
  } = useTooltip('Share Pair Liquidity', {
    placement: 'left-end',
    trigger: 'hover',
  });

  const urlLink = urlRoute.addLiquidity({
    inputCurrency: currency0.isNative ? currency0.symbol : currency0.wrapped.address,
    outputCurrency: currency1.isNative ? currency1.symbol : currency1.wrapped.address,
  }).to;

  return (
    <Tr>
      {/* LP pairs */}
      <StyledTd pl="0">
        <RowMiddle>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={28} />
          <StyledValue fontWeight={500}>
            {!currency0 || !currency1 ? (
              <Dots>
                <span>Loading</span>
              </Dots>
            ) : (
              `${currency0.symbol}-${currency1.symbol}`
            )}
          </StyledValue>
        </RowMiddle>
      </StyledTd>

      {/* Pool */}
      <StyledTd>
        <RowCenter>
          <CopyToClipboard toCopy={pair.liquidityToken.address}>
            <StyledValue>{truncateHash(pair.liquidityToken.address, 6, 3)}</StyledValue>
          </CopyToClipboard>
        </RowCenter>
      </StyledTd>

      {/* TVL */}
      {!hideTLV && (
        <StyledTd>
          <StyledValue>$1.2133M</StyledValue>
        </StyledTd>
      )}

      {/* Volume */}
      {!hideVolume && (
        <StyledTd>
          <StyledValue> $371.42K</StyledValue>
        </StyledTd>
      )}

      {/* APR */}
      <StyledTd>
        <RowCenter>
          <StyledValue mr="8px" color="mark">
            60%
          </StyledValue>
          <RowFixed mb="2px">
            <QuestionHelper text="apr" />
          </RowFixed>
        </RowCenter>
      </StyledTd>

      {/* Fee */}
      {!hideFee && (
        <StyledTd position="relative">
          <StyledValue>$524.24</StyledValue>
        </StyledTd>
      )}

      {/* Action */}
      <StyledTd>
        <RowCenter justifyContent="flex-end !important">
          <Box ref={targetRefAdd}>
            <Button
              as={NextLinkFromReactRouter}
              href={urlLink}
              ml="auto"
              mr="8px"
              radius="tiny"
              width="28px"
              height="28px"
              p="0"
              variant="primary"
            >
              <PlusIcon />
            </Button>
            {tooltipVisibleAdd && tooltipAdd}
          </Box>
          <RowCenter ref={targetRefShare} width="28px !important" height="28px" flex="unset">
            <IconButtonStatus
              background="transparent"
              p="0 !important"
              width="100% !important"
              height="100% !important"
            >
              <ButtonBorderGradient
                width="28px"
                height="28px"
                minWidth="28px"
                minHeight="28px"
                radius="tiny"
                style={{
                  padding: '0',
                }}
                background={RoboTheme.colors.formSecondary}
                onClick={() => copyContent(window.location.origin + urlLink)}
              >
                <ShareSecondaryIcon />
              </ButtonBorderGradient>
            </IconButtonStatus>
            {tooltipVisibleShare && tooltipShare}
          </RowCenter>
        </RowCenter>
      </StyledTd>
    </Tr>
  );
};

const StyledTd = styled(Td)`
  text-align: center;
`;

const StyledValue = styled(Text).attrs({ scale: 'sm' })``;

export default PoolRowDesktop;
