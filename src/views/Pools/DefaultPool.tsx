import { Flex } from 'components/Box';
import { Column } from 'components/Layout/Column';
import { RowBetween, RowCenter } from 'components/Layout/Row';
import CircleLoader from 'components/Loader/CircleLoader';
import Text from 'components/Text';
import { UNSUPPORTED_V2POOL_CHAIN_IDS } from 'config/constants/chains';
import { BIG_INT_ZERO } from 'config/constants/misc';
import { Pair } from 'config/v2-sdk';
import { useV2Pairs } from 'hooks/pool/useV2Pairs';
import { useTokenBalancesWithLoadingIndicator } from 'hooks/useBalances';
import JSBI from 'jsbi';
import { useAccount } from 'packages/wagmi/src';
import React, { useMemo } from 'react';
import { useFarmQuery } from 'state/farms/hooks';
import { useStakingInfo } from 'state/stake/hooks';
import {toV2LiquidityToken, useSelectedChainNetwork, useTrackedTokenPairs} from 'state/user/hooks';
import styled from 'styled-components';
import { EmptyIcon } from 'svgs';
import { vaildItem } from 'utils';
import EmptyPool from './components/EmptyPool';
import PoolFilter from './components/PoolFilter';
import PoolTable from './components/PoolsTable';
import { createFilterPair } from './utils/filterPoolByQuery';

const DefaultPool: React.FC = () => {
  const chainId = useSelectedChainNetwork();
  const { address } = useAccount();

  const unsupportedV2Network = chainId && UNSUPPORTED_V2POOL_CHAIN_IDS.includes(chainId);
  const [query] = useFarmQuery();

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
  const [v2PairsBalances] = useTokenBalancesWithLoadingIndicator(address ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  );

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens));
  const v2IsLoading = v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  const stakingInfo = useStakingInfo();
  const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
    JSBI.greaterThan(pool.stakedAmount.quotient, BIG_INT_ZERO),
  );
  const stakingPairs = useV2Pairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens));

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
    return (
      stakingPairs
        ?.map((stakingPair) => stakingPair[1])
        .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    );
  });

  const poolList = useMemo((): Pair[] => {
    return v2PairsWithoutStakedAmount
      ?.map((pair) => {
        if (query) {
          const filterToken = createFilterPair(query);
          if (!filterToken(pair)) return null;
        }

        return pair;
      })
      .filter(vaildItem);
  }, [query, v2PairsWithoutStakedAmount]);

  return (
    <Wrapper>
      <RowBetween
        flexWrap="wrap"
        height="max-content"
        flexDirection={['column', 'column', 'row']}
        alignItems={['flex-start !important', '', '', '', '', 'center !important']}
        mb={['16px', '', '24px']}
        width="100%"
      >
        <StyledTitle>Liquidity Pools</StyledTitle>
        <Flex flex="1 1" maxWidth={['100%', '', '420px']} justifyContent="flex-end">
          <PoolFilter />
        </Flex>
      </RowBetween>
      {v2IsLoading ? (
        <RowCenter>
          <CircleLoader />
        </RowCenter>
      ) : poolList.length === 0 && stakingPairs.length === 0 ? (
        <EmptyPool />
      ) : (
        <PoolTable pairs={poolList} stakingInfosWithBalance={stakingInfosWithBalance} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Column)`
  width: 100%;
  min-height: 300px;
  align-items: flex-start;

  ${EmptyIcon} {
    width: 48px;
    height: 48px;
  }
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
export default DefaultPool;
