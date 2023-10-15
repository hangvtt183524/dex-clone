import { useMemo } from 'react';

import { Currency, CurrencyAmount, Token, TradeType } from 'config/sdk-core';
import { Pair, Trade } from 'config/v2-sdk';
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from 'config/tokens';
import { flatMap } from 'lodash';
import { useSelectedChainNetwork } from 'state/user/hooks';
import { PairState, useV2Pairs } from './pool/useV2Pairs';

export function useAllCommonPairs(
  currencyA?: Token,
  currencyB?: Token,
  options?: {
    isUniswap?: boolean;
  },
): Pair[] {
    const chainId = useSelectedChainNetwork();

  const [tokenA, tokenB] = chainId ? [currencyA, currencyB] : [undefined, undefined];

  const bases: Token[] = useMemo(() => {
    if (!chainId) return [];

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : [];
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : [];

    return [...common, ...additionalA, ...additionalB];
  }, [chainId, tokenA, tokenB]);

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
    [bases],
  );

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs,
          ]
            .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA_, tokenB_]) => {
              if (!chainId) return true;
              const customBases = CUSTOM_BASES[chainId];

              const customBasesA: Token[] | undefined = customBases?.[tokenA_.address];
              const customBasesB: Token[] | undefined = customBases?.[tokenB_.address];

              if (!customBasesA && !customBasesB) return true;

              if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false;
              if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false;

              return true;
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId],
  );

  const allPairs = useV2Pairs(allPairCombinations, options);

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr;
            return memo;
          }, {}),
      ),
    [allPairs],
  );
}

export function useTradeExactIn(
  currencyAmountIn?: CurrencyAmount<Currency>,
  currencyOut?: Currency,
  options?: {
    isUniswap?: boolean;
  },
): Trade<Currency, Currency, TradeType> | null {
  const v2Pairs = useAllCommonPairs(currencyAmountIn?.currency as Token, currencyOut as Token, options);

  return useMemo(() => {
    if (!currencyAmountIn) {
      return null;
    }
    if (currencyAmountIn && currencyOut && v2Pairs.length > 0) {
      return (
        Trade.bestTradeExactIn(v2Pairs, currencyAmountIn as any, currencyOut, {
          maxHops: 3,
          maxNumResults: 1,
        })[0] ?? null
      );
    }
    return null;
  }, [v2Pairs, currencyAmountIn, currencyOut]);
}

export function useTradeExactOut(
  currencyIn?: Currency,
  currencyAmountOut?: CurrencyAmount<Currency>,
  options?: {
    isUniswap?: boolean;
  },
): Trade<Currency, Currency, TradeType> | null {
  const v2Pairs = useAllCommonPairs(currencyIn as Token, currencyAmountOut?.currency as Token, options);

  return useMemo(() => {
    if (!currencyAmountOut) return null;

    if (currencyIn && currencyAmountOut && v2Pairs.length > 0) {
      return (
        Trade.bestTradeExactOut(v2Pairs, currencyIn, currencyAmountOut as any, {
          maxHops: 3,
          maxNumResults: 1,
        })[0] ?? null
      );
    }
    return null;
  }, [v2Pairs, currencyIn, currencyAmountOut]);
}
