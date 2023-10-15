import { Box, Grid } from 'components/Box';
import { AutoColumn } from 'components/Layout/Column';
import { AutoRow, RowFixed } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import Text from 'components/Text';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';

import { Card } from 'components/Card';
import { Currency, SupportedChainId } from 'config/sdk-core';
import { useTranslation } from 'react-i18next';
import { useTokenData, useTokenPriceData } from 'subgraph/contexts/TokenData';
import { formattedNum, formattedPercent } from 'subgraph/contexts/utils';
import { displayBalanceEthValue } from 'utils/numbersHelper';
import {useSelectedChainNetwork} from 'state/user/hooks';

const SwapPreviewChart: React.FC<{ currency: Currency }> = ({ currency }) => {
  const chainId = useSelectedChainNetwork();

  const currencyAddress = useMemo(
    () => (chainId === SupportedChainId.MAINNET ? currency?.wrapped?.address.toLowerCase() : ''),
    [chainId, currency?.wrapped?.address],
  );

  const [
    loading,
    {
      priceUSD,
      oneDayVolumeUSD,
      totalLiquidityUSD,
      liquidityChangeUSD,
      priceChangeUSD,
      oneDayVolumeUT,
      volumeChangeUSD,
      volumeChangeUT,
    },
  ] = useTokenData(currencyAddress);

  const { price, priceChange, volume, volumeChange, liquidity, liquidityChange } = useMemo(() => {
    const price = priceUSD ? `$${displayBalanceEthValue(priceUSD)}` : '';
    const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : '';

    const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT;

    const volume = formattedNum(oneDayVolumeUSD || oneDayVolumeUT, true);
    const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUT);

    const liquidity = formattedNum(totalLiquidityUSD, true);
    const liquidityChange = formattedPercent(liquidityChangeUSD);

    return {
      price,
      priceChange,
      volume,
      volumeChange,

      liquidity,
      liquidityChange,
    };
  }, [
    liquidityChangeUSD,
    oneDayVolumeUSD,
    oneDayVolumeUT,
    priceChangeUSD,
    priceUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    volumeChangeUT,
  ]);

  const { t } = useTranslation();

  return (
    <StyledWrapper>
      <StyledWrapCurrency>
        {currency ? (
          <AutoRow gap="4px">
            <CurrencyLogo currency={currency} size={28} />
            <AutoColumn width="fit-content" gap="4px">
              <RowFixed>
                <Text mr="4px">{currency?.name}</Text>
                <Text mr="4px"> ({currency?.symbol})</Text>
              </RowFixed>
              <RowFixed>
                <Text mr="4px" fontSize="12px">
                  {price}
                </Text>
                {priceChange}
              </RowFixed>
            </AutoColumn>
          </AutoRow>
        ) : (
          <Box />
        )}
      </StyledWrapCurrency>

      <StyledWrapMoreData mt="auto" gridTemplateColumns="1fr 1fr">
        <AutoColumn
          gap="4px"
          p="8px 16px 16px"
          style={{
            borderRight: `1px solid ${RoboTheme.colors.stroke}`,
          }}
        >
          <Text fontSize="12px !important" mr="4px" color="textSecondary">
            TVL: {liquidity}
          </Text>
          {liquidityChange}
        </AutoColumn>
        <AutoColumn gap="4px" p="8px 16px 16px">
          <Text fontSize="12px !important" mr="4px" color="textSecondary">
            24H Vol: {volume}
          </Text>
          {volumeChange}
        </AutoColumn>
      </StyledWrapMoreData>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card).attrs({ variant: 'form', padding: '0 !important', radius: 'medium' })`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledWrapCurrency = styled(Grid)`
  grid-template-columns: 1.5fr 0.5fr;
  padding: 16px;
  width: 100%;
`;

const StyledWrapMoreData = styled(Grid)`
  align-items: center;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.stroke};
`;

export default SwapPreviewChart;
