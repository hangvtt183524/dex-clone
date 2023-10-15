import tryParseAmount from 'utils/tryParseAmount';

import { useMemo, useRef } from 'react';
import { RouterPreference } from 'state/routing/slice';
import { useRoutingAPITrade } from 'state/routing/useRoutingAPITrade';
import { Currency, CurrencyAmount, Price, SupportedChainId, Token, TradeType } from 'config/sdk-core';
import { STABLECOIN_AMOUNT_OUT } from 'config/tokens';
import { MAINNET_CHAIN_IDS } from 'config/constants/chains';
import { useSelectedChainNetwork } from 'state/user/hooks';
import useUSDPrice from './useUSDPrice';

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useStablecoinPrice(currency?: Currency): Price<Currency, Token> | undefined {
  const chainId = currency?.chainId;
  const amountOut = chainId
    ? STABLECOIN_AMOUNT_OUT[MAINNET_CHAIN_IDS.includes(chainId) ? chainId : SupportedChainId.MAINNET]
    : undefined;
  const stablecoin = amountOut?.currency;

  const { trade } = useRoutingAPITrade(TradeType.EXACT_OUTPUT, amountOut, currency, RouterPreference.PRICE);

  const price = useMemo(() => {
    if (!currency || !stablecoin) {
      return undefined;
    }

    // handle usdc
    if (currency?.wrapped.equals(stablecoin)) {
      return new Price(stablecoin, stablecoin, '1', '1');
    }

    if (trade) {
      const { numerator, denominator } = trade.routes[0].midPrice;
      return new Price(currency, stablecoin, denominator, numerator);
    }

    return undefined;
  }, [currency, stablecoin, trade]);

  const lastPrice = useRef(price);
  if (
    !price ||
    !lastPrice.current ||
    !price.equalTo(lastPrice.current) ||
    !price.baseCurrency.equals(lastPrice.current.baseCurrency)
  ) {
    lastPrice.current = price;
  }
  return lastPrice.current;
}

export function useStablecoinValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
  const price = useStablecoinPrice(currencyAmount?.currency);

  return useMemo(() => {
    if (!price || !currencyAmount) return null;
    try {
      return price.quote(currencyAmount);
    } catch (error) {
      return null;
    }
  }, [currencyAmount, price]);
}

export function useStableUSDValue(currencyAmount: CurrencyAmount<Currency> | undefined | null) {
  const price = useUSDPrice(currencyAmount?.currency);

  return useMemo(() => {
    if (!price || !currencyAmount) return null;
    try {
      return price.quote(currencyAmount);
    } catch (error) {
      return null;
    }
  }, [currencyAmount, price]);
}

/**
 *
 * @param fiatValue string representation of a USD amount
 * @returns CurrencyAmount where currency is stablecoin on active chain
 */
export function useStablecoinAmountFromFiatValue(fiatValue: string | null | undefined) {
  const chainId = useSelectedChainNetwork();
  const stablecoin = chainId ? STABLECOIN_AMOUNT_OUT[chainId]?.currency : undefined;

  return useMemo(() => {
    if (fiatValue === null || fiatValue === undefined || !chainId || !stablecoin) {
      return undefined;
    }

    // trim for decimal precision when parsing
    const parsedForDecimals = parseFloat(fiatValue).toFixed(stablecoin.decimals).toString();
    try {
      // parse USD string into CurrencyAmount based on stablecoin decimals
      return tryParseAmount(parsedForDecimals, stablecoin);
    } catch (error) {
      return undefined;
    }
  }, [chainId, fiatValue, stablecoin]);
}
