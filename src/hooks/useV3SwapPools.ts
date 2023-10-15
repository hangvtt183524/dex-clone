import { SupportedChainId, Currency, Token } from 'config/sdk-core';
import { FeeAmount } from 'config/pair';
import { Pool } from 'config/v3-sdk';

import { useMemo } from 'react';
import {useSelectedChainNetwork} from 'state/user/hooks';

import { usePools, PoolState } from './pool/usePools';
import { useAllCurrencyCombinations } from './Tokens';

/**
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useV3SwapPools(
  currencyIn?: Currency,
  currencyOut?: Currency,
): {
  pools: Pool[];
  loading: boolean;
} {
    const chainId = useSelectedChainNetwork();

  const allCurrencyCombinations = useAllCurrencyCombinations(currencyIn, currencyOut);

  const allCurrencyCombinationsWithAllFees: [Token, Token, FeeAmount][] = useMemo(
    () =>
      allCurrencyCombinations.reduce<[Token, Token, FeeAmount][]>((list, [tokenA, tokenB]) => {
        return chainId === SupportedChainId.MAINNET
          ? list.concat([
              [tokenA, tokenB, FeeAmount.LOW],
              [tokenA, tokenB, FeeAmount.MEDIUM],
              [tokenA, tokenB, FeeAmount.HIGH],
            ])
          : list.concat([
              [tokenA, tokenB, FeeAmount.LOWEST],
              [tokenA, tokenB, FeeAmount.LOW],
              [tokenA, tokenB, FeeAmount.MEDIUM],
              [tokenA, tokenB, FeeAmount.HIGH],
            ]);
      }, []),
    [allCurrencyCombinations, chainId],
  );

  const pools = usePools(allCurrencyCombinationsWithAllFees);

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple): tuple is [PoolState.EXISTS, Pool] => {
          return tuple[0] === PoolState.EXISTS && tuple[1] !== null;
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
    };
  }, [pools]);
}
