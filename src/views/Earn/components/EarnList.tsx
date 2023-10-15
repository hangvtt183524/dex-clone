import BigNumber from 'bignumber.js';
import { Box, Flex } from 'components/Box';
import { Card } from 'components/Card';
import { RowBetween } from 'components/Layout/Row';
import Text from 'components/Text';
import { ROBO } from 'config/tokens';
import useUSDPrice from 'hooks/usePrices/useUSDPrice';
import { orderBy } from 'lodash';
import { useRouter } from 'next/router';
import { getFarmCakeRewardApr } from 'packages/farms/configs/apr';
import { DeserializedFarm, FarmWithPrices, FarmWithStakedValue } from 'packages/farms/types';
import { filterFarmsByQuery } from 'packages/farms/utils/filterFarmsByQuery';
import React, { useCallback, useMemo } from 'react';
import { useFarmQuery, useFarmSelectSortOptions, useFarms } from 'state/farms/hooks';
import { useUserFarmStakedOnly } from 'state/user/hooks';
import styled from 'styled-components';
import { getBalanceAmount } from 'utils/numbersHelper';
import { useAccount } from 'packages/wagmi/src';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import FarmFilter from 'views/Farms/components/FarmFilter';
import FarmTable from 'views/Farms/components/FarmTable';

const FarmList: React.FC = () => {
  const { chainId } = useActiveWeb3React();
  const { isConnected } = useAccount();

  const { pathname } = useRouter();
  const { data: farmsLP, userDataLoaded } = useFarms();
  const isInactive = pathname.includes('history');
  const isActive = !isInactive;

  const [query] = useFarmQuery();

  const [stakedOnly] = useUserFarmStakedOnly(isActive);
  const [sortOption] = useFarmSelectSortOptions();

  const userDataReady = !!isConnected && userDataLoaded;
  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== '0X');
  const inactiveFarms = farmsLP.filter((farm) => farm.multiplier === '0X');
  const roboPriceUsd = useUSDPrice(ROBO[chainId]);
  const roboPrice = useMemo(
    () => (roboPriceUsd ? new BigNumber(roboPriceUsd.toFixed(ROBO?.[chainId]?.decimals)) : null),
    [chainId, roboPriceUsd],
  );

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  );

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  );

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): any[] => {
      const farmsToDisplayWithAPR: any[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm;
        }
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteTokenPriceBusd);
        const cakeRewardsApr = roboPrice
          ? getFarmCakeRewardApr(
              farm as unknown as FarmWithPrices,
              getBalanceAmount(roboPrice, ROBO?.[chainId]?.decimals).toString(10),
              farm.rewardPerBlock,
            )
          : 0;
        return {
          ...farm,
          apr: Number(cakeRewardsApr),
          liquidity: totalLiquidity,
        };
      });

      return filterFarmsByQuery(farmsToDisplayWithAPR, query);
    },
    [chainId, query, roboPrice],
  );

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr, 'desc');
        case 'fee':
          return orderBy(farms, (farm: FarmWithStakedValue) => (farm.fee ? Number(farm.fee) : 0), 'desc');
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          );
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          );
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc');
        default:
          return farms;
      }
    };

    if (isActive) {
      chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms);
    }
    if (isInactive) {
      chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms);
    }

    return sortFarms(chosenFarms);
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    isActive,
    isInactive,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ]);

  return (
    <Wrapper>
      <WrapContainer>
        <RowBetween
          flexWrap="wrap"
          height="max-content"
          flexDirection={['column', 'column', 'row']}
          alignItems={['flex-start !important', '', '', '', '', 'center !important']}
          mb={['16px', '', '24px']}
          width="100%"
        >
          <StyledTitle>Earn</StyledTitle>
          <Flex flex="1 1" width="100%" justifyContent="flex-end">
            <FarmFilter />
          </Flex>
        </RowBetween>
        <FarmTable farms={chosenFarmsMemoized} roboPrice={roboPrice} userDataReady={userDataReady} />
      </WrapContainer>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.siteWidth}px;
  padding: 1.25px 0.8px;
  background: linear-gradient(177.36deg, #3a92e2 2.21%, rgba(111, 180, 199, 0) 79.07%);
  border-radius: ${({ theme }) => theme.radius.medium};
`;

const WrapContainer = styled(Card)`
  width: 100%;
  background: #131415;
  padding: 24px;
`;

const StyledTitle = styled(Text)`
  font-weight: 600;
  white-space: nowrap;
  margin-right: 24px;
  font-size: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    color: #77e9ff;
    font-size: 18px;
  }
`;
export default FarmList;
