import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Box, Flex, Grid } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import ButtonGroup from 'components/ButtonGroup/ButtonGroup';
import ButtonItemGroup from 'components/ButtonGroup/ButtonItemGroup';
import { Card, CardProps } from 'components/Card';
import mockData from 'components/Chart/mock/data-chart.json';
import { Column } from 'components/Layout/Column';
import { RowBetween, RowFixed } from 'components/Layout/Row';
import CircleLoader from 'components/Loader/CircleLoader';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import Select from 'components/Select/Select';
import Text from 'components/Text';
import { Currency } from 'config/sdk-core';
import { CHART_FILTER_ITEMS, LiveDataTimeframeEnum } from 'hooks/useBasicChartData';
import useMatchBreakpoints from 'hooks/useMatchBreakPoints';
import dynamic from 'next/dynamic';
import { Trans } from 'react-i18next';
import RoboTheme from 'styles';
import { CopyIcon, GlobalIcon, TelegramIcon, TwitterIcon, WarningOutLineIcon } from 'svgs';
import { truncateHash } from 'utils/addressHelpers';
import { copyContent } from 'utils/copy';

const AreaChart = dynamic(() => import('components/Chart/AreaChart', { ssr: false } as any));

const options = CHART_FILTER_ITEMS.map((chartFilter) => ({
  label: chartFilter.label,
  value: chartFilter.value,
}));

const TrendingChart: React.FC<{ currency: Currency } & CardProps> = ({ currency, ...props }) => {
  const { isDesktop, isXxl } = useMatchBreakpoints();

  const [selectedChartPeriod, setSelectedChartPeriod] = useState(LiveDataTimeframeEnum.DAY);
  // const {
  //   data: chartData,
  //   error: basicChartError,
  //   loading: basicChartLoading,
  // } = useBasicChartData(currencyA && currencyB ? currency : [], selectedChartPeriod);

  const chartData = mockData;
  const basicChartError = false;
  const basicChartLoading = false;

  const isBasicchartError = !currency || (basicChartError && !basicChartLoading);

  const handleSelectChartPeriod = useCallback((period: any) => {
    setSelectedChartPeriod(period);
  }, []);

  const optionSelectedIndex = useMemo(
    () => options.findIndex((option) => option.value === selectedChartPeriod),
    [selectedChartPeriod],
  );

  return (
    <StyledWrapper {...(props as any)}>
      <Column width="100%">
        <RowBetween>
          {currency ? (
            <RowFixed>
              <CurrencyLogo currency={currency} size={28} />
              <Text ml="8px" fontSize="16px" fontWeight={500}>
                {currency?.symbol}
              </Text>
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
                  onOptionChange={handleSelectChartPeriod}
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
        <Grid mt="16px" gridGap="8px" gridTemplateColumns="repeat(4,auto)" width="fit-content">
          <StyledIconButton p="4px !important">
            <GlobalIcon size="20px" fill="transparent" />
          </StyledIconButton>
          <StyledIconButton>
            <TelegramIcon size="24px" pathFill="#FFF" />
          </StyledIconButton>
          <StyledIconButton>
            <TwitterIcon size="24px" pathFill="#FFF" />
          </StyledIconButton>
          <StyledIconButton
            style={{
              borderRadius: RoboTheme.radius.huge,
            }}
            onClick={() => copyContent(currency.wrapped.address)}
          >
            <RowFixed p="3px 8px">
              <Text mr="6px" color="textSubtle" fontSize="10px">
                Token: {truncateHash(currency.wrapped.address)}
              </Text>
              <CopyIcon width="16px" />
            </RowFixed>{' '}
          </StyledIconButton>
        </Grid>{' '}
      </Column>
      <Box width="100%" height={400}>
        {basicChartLoading || isBasicchartError || !currency || !currency.chainId ? (
          <Flex height="100%" flexDirection="column" alignItems="center" justifyContent="center">
            {basicChartLoading ? (
              <CircleLoader />
            ) : (
              isBasicchartError && (
                <>
                  <WarningOutLineIcon />
                  <Text mt="4px" color="textSubtle" fontSize="16px">
                    <Trans>Chart is unavailable right now</Trans>
                  </Text>
                </>
              )
            )}
          </Flex>
        ) : (
          <AreaChart
            hidePriceScale={!(isDesktop && !isXxl)}
            currency={currency}
            height={320}
            data={chartData}
            selectedChartPeriod={selectedChartPeriod}
          />
        )}
      </Box>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Card).attrs({ variant: 'form', padding: '0', radius: 'medium', boxShadow: 'normal' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02)), #1c1c1e;
  padding: 20px 16px;
  backdrop-filter: blur(0);
  height: 100%;
`;

const StyledIconButton = styled(IconButton)`
  background: #373738 !important;
  padding: 2px;
  border-radius: 50%;
`;

export default TrendingChart;
