import { skipToken } from '@reduxjs/toolkit/query/react';
import { CurrencyAmount, Currency } from 'config/sdk-core';
import { TradeType } from 'config/pair';
import { useStablecoinAmountFromFiatValue } from 'hooks/usePrices/useStablecoinPrice';
import { useMemo } from 'react';
import { RouterPreference, useGetQuoteQuery } from 'state/routing/slice';
import ms from 'ms.macro';
import { Protocol } from 'config/router-sdk';
import { useRoutingAPIArguments } from './hooks/useRoutingAPIArguments';

import { InterfaceTrade, TradeState } from './types';
import { computeRoutes, getSwapProtocol, transformRoutesToTrade } from './utils';

/**
 * Returns the best trade by invoking the routing api or the smart order router on the client
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useRoutingAPITrade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified: CurrencyAmount<Currency> | undefined,
  otherCurrency: Currency | undefined,
  routerPreference: RouterPreference,
): {
  state: TradeState;
  trade: InterfaceTrade<Currency, Currency, TTradeType> | undefined;
} {
  const [currencyIn, currencyOut]: [Currency | undefined, Currency | undefined] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [amountSpecified, otherCurrency, tradeType],
  );

  const queryArgs = useRoutingAPIArguments({
    tokenIn: currencyIn,
    tokenOut: currencyOut,
    amount: amountSpecified,
    tradeType,
    routerPreference,
  });

  const {
    isLoading,
    isError,
    data: quoteResult,
    currentData,
  } = useGetQuoteQuery(queryArgs ?? skipToken, {
    // Price-fetching is informational and costly, so it's done less frequently.
    pollingInterval: routerPreference === RouterPreference.PRICE ? ms`2m` : ms`15s`,
  });

  const route = useMemo(
    () => computeRoutes(currencyIn, currencyOut, tradeType, quoteResult),
    [currencyIn, currencyOut, tradeType, quoteResult],
  );

  // get USD gas cost of trade in active chains stablecoin amount
  const gasUseEstimateUSD = useStablecoinAmountFromFiatValue(quoteResult?.gasUseEstimateUSD) ?? null;
  const isSyncing = currentData !== quoteResult;

  return useMemo(() => {
    if (!currencyIn || !currencyOut) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
      };
    }

    if (isLoading && !quoteResult) {
      // only on first hook render

      return {
        state: TradeState.LOADING,
        trade: undefined,
      };
    }

    let otherAmount;
    if (quoteResult) {
      if (tradeType === TradeType.EXACT_INPUT && currencyOut) {
        otherAmount = CurrencyAmount.fromRawAmount(currencyOut, quoteResult.quote);
      }

      if (tradeType === TradeType.EXACT_OUTPUT && currencyIn) {
        otherAmount = CurrencyAmount.fromRawAmount(currencyIn, quoteResult.quote);
      }
    }

    if (isError || !otherAmount || !route || route.length === 0 || !queryArgs) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      };
    }

    try {
      const trade = transformRoutesToTrade(route, tradeType, quoteResult?.blockNumber, gasUseEstimateUSD);

      const protocol = getSwapProtocol(trade);
      const isSwapV2 = protocol === Protocol.V2;

      if (!isSwapV2) {
        // TODO, PREVENT SWAP IF THAT'S NOT ROUTE V2
        return {
          state: TradeState.NO_ROUTE_FOUND,
          trade: undefined,
        };
      }

      return {
        // always return VALID regardless of isFetching status
        state: isSyncing ? TradeState.SYNCING : TradeState.VALID,
        trade,
      };
    } catch (e) {
      return { state: TradeState.INVALID, trade: undefined };
    }
  }, [
    currencyIn,
    currencyOut,
    quoteResult,
    isLoading,
    tradeType,
    isError,
    route,
    queryArgs,
    gasUseEstimateUSD,
    isSyncing,
  ]);
}
