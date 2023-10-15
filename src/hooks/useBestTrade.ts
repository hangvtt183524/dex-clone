import { Currency, CurrencyAmount, TradeType } from 'config/sdk-core';
import { Trade } from 'config/v2-sdk';
import { useMemo } from 'react';
import { InterfaceTrade, TradeState } from 'state/routing/types';

import { STABLECOIN } from 'config/tokens';
import useFindBestRoute from './useClientSideV2Trade';
// import { useClientSideV3Trade } from './useClientSideV3Trade';

/**
 * Returns the best v2+v3 trade for a desired swap.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestTrade(
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
): {
  isUniswap?: boolean;
  state: TradeState;
  trade: InterfaceTrade<Currency, Currency, TradeType> | Trade<Currency, Currency, TradeType> | undefined;
} {
  // const autoRouterSupported = useAutoRouterSupported();
  // const isWindowVisible = useIsWindowVisible();

  const [debouncedAmount, debouncedOtherCurrency] = useMemo(
    () => [amountSpecified, otherCurrency],
    [amountSpecified, otherCurrency],
  );

  const mapStableCoinAddress = useMemo(() => {
    return STABLECOIN[debouncedAmount?.currency?.chainId]?.reduce((state, token) => {
      state[token.address.toLowerCase()] = token;
      return state;
    }, {});
  }, [debouncedAmount]);

  const isAcceptSwapAtRoboRoute = useMemo(() => {
    if (
      mapStableCoinAddress?.[debouncedAmount?.currency?.wrapped?.address?.toLowerCase()] &&
      mapStableCoinAddress?.[debouncedOtherCurrency?.wrapped?.address?.toLowerCase()]
    ) {
      return false;
    }
    return true;
  }, [debouncedAmount, debouncedOtherCurrency, mapStableCoinAddress]);

  const bestRoute = useFindBestRoute(
    tradeType,
    isAcceptSwapAtRoboRoute ? debouncedAmount : undefined,
    isAcceptSwapAtRoboRoute ? debouncedOtherCurrency : undefined,
  );
  const bestRouteUniswap = useFindBestRoute(
    tradeType,
    !bestRoute || bestRoute.state === TradeState.INVALID ? debouncedAmount : undefined,
    !bestRoute || bestRoute.state === TradeState.INVALID ? debouncedOtherCurrency : undefined,
    {
      isUniswap: true,
    },
  );

  const route = useMemo(
    () =>
      (bestRoute.state === TradeState.INVALID ? bestRouteUniswap : bestRoute) || {
        trade: {},
        state: TradeState.INVALID,
      },
    [bestRoute, bestRouteUniswap],
  );
  return useMemo(
    () => ({
      ...route,
    }),
    [route],
  );
}
