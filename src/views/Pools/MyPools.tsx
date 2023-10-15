import { Flex, Grid } from 'components/Box';
import { Column } from 'components/Layout/Column';
import PositionCard from 'components/PositionCard';
import Text from 'components/Text';
import { UNSUPPORTED_V2POOL_CHAIN_IDS } from 'config/constants/chains';
import { Pair } from 'config/v2-sdk';
import { useV2Pairs } from 'hooks/pool/useV2Pairs';
import { useTokenBalancesWithLoadingIndicator } from 'hooks/useBalances';
import { useAccount } from 'packages/wagmi/src';
import React, { useMemo } from 'react';
import { useFarmQuery } from 'state/farms/hooks';
import {toV2LiquidityToken, useSelectedChainNetwork, useTrackedTokenPairs} from 'state/user/hooks';
import styled from 'styled-components';
import { EmptyIcon } from 'svgs';
import { vaildItem } from 'utils';
import EmptyPool from './components/EmptyPool';
import PoolFilter from './components/PoolFilter';
import { createFilterPair } from './utils/filterPoolByQuery';

const MyPools: React.FC = () => {
    const chainId = useSelectedChainNetwork();
  const { address } = useAccount();
  const [query] = useFarmQuery();

  const unsupportedV2Network = chainId && UNSUPPORTED_V2POOL_CHAIN_IDS.includes(chainId);

  // fetch the user's balances of all tracked V2 LP tokens
  let trackedTokenPairs = useTrackedTokenPairs();
  if (unsupportedV2Network) trackedTokenPairs = [];
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs],
  );

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  );

  const [
    v2PairsBalances,
    // fetchingV2PairBalances
  ] = useTokenBalancesWithLoadingIndicator(address ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  );

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens));
  // const v2IsLoading =
  //   fetchingV2PairBalances ||
  //   v2Pairs?.length < liquidityTokensWithBalances.length ||
  //   v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  // show liquidity even if its deposited in rewards contract
  // const stakingInfo = useStakingInfo();
  // const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
  //   JSBI.greaterThan(pool.stakedAmount.quotient, BIG_INT_ZERO),
  // );

  // const stakingPairs = useV2Pairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens));

  // remove any pairs that also are included in pairs with stake in mining pool
  // const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
  //   return (
  //     stakingPairs
  //       ?.map((stakingPair) => stakingPair[1])
  //       .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
  //   );
  // });

  const poolList = useMemo((): Pair[] => {
    return allV2PairsWithLiquidity
      ?.map((pair) => {
        if (query) {
          const filterToken = createFilterPair(query);
          if (!filterToken(pair)) return null;
        }

        return pair;
      })
      .filter(vaildItem);
  }, [query, allV2PairsWithLiquidity]);

  return (
    <Wrapper>
      <StyledWrapTitle>
        <StyledTitle>My Liquidity Pools</StyledTitle>
        <Flex flex="1 1" maxWidth={['100%', '', '420px']} justifyContent="flex-end">
          <PoolFilter />
        </Flex>
      </StyledWrapTitle>

      {poolList.length === 0 ? (
        <EmptyPool />
      ) : (
        <Grid
          width="100%"
          gridTemplateColumns={['1fr', '', '', 'repeat(2, 1fr)', '', '', 'repeat(3, 1fr)']}
          gridGap="26px"
        >
          {poolList.map((v2Pair) => (
            <PositionCard p="24px" key={v2Pair.liquidityToken.address} pair={v2Pair} />
          ))}
          {/* {stakingPairsQuery.map(
            (stakingPair, i) =>
              stakingPair[1] && ( // skip pairs that arent loaded
                <PositionCard
                  p="24px"
                  key={stakingInfosWithBalance[i].stakingRewardAddress}
                  pair={stakingPair[1]}
                  stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                />
              ),
          )} */}
        </Grid>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  width: 100%;
  min-height: 300px;

  ${({ theme }) => theme.mediaQueries.sm} {
    .wrap-filter {
      width: auto;
    }
  }
  ${EmptyIcon} {
    width: 48px;
    height: 48px;
  }
`;

const StyledTitle = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 16px;
  white-space: nowrap;
`;

const StyledWrapTitle = styled(Column)`
  flex-wrap: wrap;
  height: max-content;
  margin-bottom: 24px;
  height: 100%;

  #search {
    max-width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    #search {
      max-width: 320px;
    }

    ${StyledTitle} {
      margin-right: 16px;
      margin-bottom: 0;
      font-size: 18px;
      color: #77e9ff;
    }
  }
`;

export default MyPools;
