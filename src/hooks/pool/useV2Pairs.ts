import { IPAIR } from 'config/abis';
import { Currency, CurrencyAmount } from 'config/sdk-core';
import { Pair, computePairAddress } from 'config/v2-sdk';
import { useMemo } from 'react';
import { useMultipleContractSingleData } from 'state/multicall/hooks';
import { getFactoryV2Address, getFactoryV2AddressUniswap } from 'utils/addressHelpers';

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useV2Pairs(
  currencies: [Currency | undefined, Currency | undefined][],
  options?: {
    isUniswap?: boolean;
  },
): [PairState, Pair | null][] {
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies],
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        const factory =
          tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          (options?.isUniswap ? getFactoryV2AddressUniswap(tokenA.chainId) : getFactoryV2Address(tokenA.chainId));

        return factory
          ? computePairAddress({
              factoryAddress: factory,
              tokenA,
              tokenB,
              isUniswap: options?.isUniswap,
            })
          : undefined;
      }),
    [options?.isUniswap, tokens],
  );

  const results = useMultipleContractSingleData(pairAddresses, IPAIR, 'getReserves');

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const [reserve0, reserve1] = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0?.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1?.toString()),
          options?.isUniswap,
        ),
      ];
    });
  }, [options, results, tokens]);
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB]);
  return useV2Pairs(inputs)[0];
}
