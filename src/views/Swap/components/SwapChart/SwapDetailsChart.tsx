import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Box, Flex } from 'components/Box';
import ButtonGroup from 'components/ButtonGroup/ButtonGroup';
import ButtonItemGroup from 'components/ButtonGroup/ButtonItemGroup';
import { Card } from 'components/Card';
import { RowBetween, RowFixed } from 'components/Layout/Row';
import CircleLoader from 'components/Loader/CircleLoader';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import Select from 'components/Select/Select';
import Text from 'components/Text';
import { Currency, SupportedChainId } from 'config/sdk-core';
import { STABLECOIN } from 'config/tokens';
import { CHART_FILTER_ITEMS, LiveDataTimeframeEnum } from 'hooks/useBasicChartData';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import dynamic from 'next/dynamic';
import { Trans } from 'react-i18next';
import { useTokenPriceData } from 'subgraph/contexts/TokenData';
import { WarningOutLineIcon } from 'svgs';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';

const BaseLineChart = dynamic(() => import('components/Chart/BaseLineChart', { ssr: false } as any));
const options = CHART_FILTER_ITEMS.map((chartFilter) => ({
  label: chartFilter.label,
  value: chartFilter.value,
}));

const SwapDetailsChart: React.FC<{ tokens: Currency[] }> = ({ tokens }) => {
  const { isDesktop, isXxl } = useMatchBreakpoints();
  const { chainId } = useActiveWeb3React();

  const mapStableCoinAddress = useMemo(() => {
    return STABLECOIN[chainId].reduce((state, token) => {
      state[token.address.toLowerCase()] = token;
      return state;
    }, {});
  }, [chainId]);

  const [currencyA, currencyB] = useMemo(() => {
    const token0 = tokens?.[0] || null;
    const token1 = tokens?.[1] || null;
    return [token0, token1];
  }, [tokens]);

  const [currencyIn, currencyOut] = useMemo(() => {
    const outIsStableCoin = mapStableCoinAddress[currencyB && currencyB?.wrapped.address.toLowerCase()];

    if (outIsStableCoin) {
      return [currencyB, currencyA];
    }

    return [currencyA, currencyB];
  }, [currencyA, currencyB, mapStableCoinAddress]);

  const [selectedChartPeriod, setSelectedChartPeriod] = useState(LiveDataTimeframeEnum.DAY);

  const handleSelectChartPeriod = useCallback((period: any) => {
    setSelectedChartPeriod(period);
  }, []);

  const optionSelectedIndex = useMemo(
    () => options.findIndex((option) => option.value === selectedChartPeriod),
    [selectedChartPeriod],
  );

  const [loading, data] = useTokenPriceData(
    currencyOut && SupportedChainId.MAINNET === chainId && currencyOut?.wrapped.address.toLowerCase(),
    selectedChartPeriod,
    3600,
  );

  const dataChart = useMemo(
    () =>
      data
        ? data.map((item) => ({
            ...item,
            value: item.close,
          }))
        : [],
    [data],
  );

  const isBasicchartError =
    !currencyIn || !currencyOut || !dataChart || (!loading && (!dataChart || dataChart?.length === 0));

  const isBasicChartLoading = loading;

  const renderChart = useMemo(
    () => (
      <BaseLineChart
        hidePriceScale={!(isDesktop && !isXxl)}
        height={320}
        data={dataChart}
        selectedChartPeriod={selectedChartPeriod}
      />
    ),
    [dataChart, isDesktop, isXxl, selectedChartPeriod],
  );

  return (
    <StyledWrapper>
      <RowBetween>
        {currencyIn && currencyOut ? (
          <RowFixed>
            <RowFixed>
              <DoubleCurrencyLogo
                currency0={currencyIn} // .equals(currency0) ? currency0 : currency1
                currency1={currencyOut} // .equals(currency0) ? currency0 : currency1
                size={28}
              />
              <Text color="text" fontWeight={600}>
                {`${currencyIn?.symbol}/${currencyOut?.symbol}`}
              </Text>
            </RowFixed>
          </RowFixed>
        ) : (
          <Box />
        )}
        <ButtonGroup justifyContent="flex-end !important">
          {!isDesktop ? (
            <Box>
              <Select
                minWidth="80px !important"
                options={options}
                defaultOptionIndex={optionSelectedIndex}
                onOptionChange={(option) => {
                  handleSelectChartPeriod(option.value);
                }}
              />
            </Box>
          ) : (
            CHART_FILTER_ITEMS.map((chartFilterItem) => (
              <ButtonItemGroup
                key={`select-period-chart-${chartFilterItem.value}`}
                onClick={() => handleSelectChartPeriod(chartFilterItem.value)}
                active={chartFilterItem.value === selectedChartPeriod}
                p="0 16px"
                height="28px"
                width="fit-content"
              >
                {chartFilterItem.label}
              </ButtonItemGroup>
            ))
          )}
        </ButtonGroup>
      </RowBetween>

      <Box width="100%" height={370}>
        {isBasicChartLoading || isBasicchartError ? (
          <Flex height="100%" flexDirection="column" alignItems="center" justifyContent="center">
            {isBasicChartLoading ? (
              <CircleLoader />
            ) : (
              <>
                <WarningOutLineIcon />
                <Text mt="4px" color="textSubtle" fontSize="16px">
                  <Trans>Chart is unavailable right now</Trans>
                </Text>
              </>
            )}
          </Flex>
        ) : (
          renderChart
        )}
      </Box>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card).attrs({ variant: 'form', padding: '0', radius: 'medium', boxShadow: 'form' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  padding: 20px 16px;
  backdrop-filter: blur(0);
  height: 100%;
`;

export default React.memo(SwapDetailsChart);
