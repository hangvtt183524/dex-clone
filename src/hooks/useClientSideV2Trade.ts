import { useMemo } from 'react';

import { Currency, CurrencyAmount, TradeType } from 'config/sdk-core';
import { InterfaceTrade, TradeState } from 'state/routing/types';
import { useTradeExactIn, useTradeExactOut } from './Trade';

const useFindBestRoute = (
  tradeType: TradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  options?: {
    isUniswap?: boolean;
  },
) => {
  const [currencyIn, currencyOut] =
    tradeType === TradeType.EXACT_INPUT
      ? [amountSpecified?.currency, otherCurrency]
      : [otherCurrency, amountSpecified?.currency];
  const isExactIn: boolean = tradeType === TradeType.EXACT_INPUT;

  const bestTradeExactIn = useTradeExactIn(
    isExactIn ? amountSpecified : undefined,
    otherCurrency ?? undefined,
    options,
  );
  const bestTradeExactOut = useTradeExactOut(
    otherCurrency ?? undefined,
    !isExactIn ? amountSpecified : undefined,
    options,
  );
  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  return useMemo(() => {
    if (
      v2Trade === null ||
      !amountSpecified ||
      !currencyIn ||
      !currencyOut ||
      (tradeType === TradeType.EXACT_INPUT
        ? amountSpecified.currency.equals(currencyOut)
        : amountSpecified.currency.equals(currencyIn))
    ) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
      };
    }

    return {
      isUniswap: options?.isUniswap,
      state: TradeState.VALID,
      trade: new InterfaceTrade({
        v2Routes: [
          {
            routev2: v2Trade?.route,
            inputAmount: v2Trade.inputAmount,
            outputAmount: v2Trade.outputAmount,
          },
        ],
        v3Routes: [],
        tradeType,
      }),
    };
  }, [amountSpecified, currencyIn, currencyOut, tradeType, v2Trade, options]);
};

export default useFindBestRoute;
