import { Currency, CurrencyAmount, Percent } from 'config/sdk-core';
import { BIPS_BASE } from 'config/constants/number';
import { TradeType } from 'config/pair';
import tryParseAmount from 'utils/tryParseAmount';
import { useCurrency } from 'hooks/Tokens';
import { useCurrencyBalances } from 'hooks/useBalances';
import { useBestTrade } from 'hooks/useBestTrade';
import JSBI from 'jsbi';
import { Trans } from 'react-i18next';
import React, { ReactNode, useMemo } from 'react';
import { InterfaceTrade, TradeState } from 'state/routing/types';
import { useAppSelector } from 'state/store';
import { useUserSlippageTolerance } from 'state/user/hooks';
import { isAddress } from 'utils/addressHelpers';
import useDebounce from 'hooks/useDebounce';
import { useAccount } from 'packages/wagmi/src';
import { Dots } from 'styles/common';
import { BAD_RECIPIENT_ADDRESSES } from 'config/constants/contracts';
import { Field } from './actions';

export const useSwapState = () => useAppSelector((state) => state.swap);

export const useInfoTokenSwap = (): {
  currencies: { [field in Field]?: Currency };
  parsedAmount: CurrencyAmount<Currency> | undefined;
} => {
  const {
    [Field.INPUT]: { currencyId: inputTokenId },
    [Field.OUTPUT]: { currencyId: outputTokenId },
    independentField,
    typedValue,
  } = useSwapState();

  const inputToken = useCurrency(inputTokenId);
  const outputToken = useCurrency(outputTokenId);

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputToken ?? undefined,
    [Field.OUTPUT]: outputToken ?? undefined,
  };

  const isExactIn: boolean = independentField === Field.INPUT;

  const parsedAmount = tryParseAmount(
    typedValue,
    (isExactIn ? currencies[Field.INPUT] : currencies[Field.OUTPUT]) ?? undefined,
  );

  return {
    currencies,
    parsedAmount,
  };
};

export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency | null };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };
  parsedAmount: CurrencyAmount<Currency> | undefined;
  inputError?: ReactNode;
  trade: {
    isUniswap?: boolean;
    trade: InterfaceTrade<Currency, Currency, TradeType> | undefined;
    state: TradeState;
  };
  allowedSlippage: Percent;
} {
  const { address } = useAccount();

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);

  const to: string | null = address ?? null;

  const relevantTokenBalances = useCurrencyBalances(
    address ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency]),
  );
  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = useMemo(
    () => tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue],
  );

  const debounceTypedValueIn = useDebounce(typedValue, 500);

  const parsedAmountTrade = useMemo(
    () => tryParseAmount(debounceTypedValueIn, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, debounceTypedValueIn],
  );

  const trade = useBestTrade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    parsedAmountTrade,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
  );

  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }),
    [relevantTokenBalances],
  );

  const currencies: { [field in Field]?: Currency | null } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency],
  );

  const [allowedSlippage] = useUserSlippageTolerance();

  const inputError = useMemo(() => {
    let inputError: ReactNode | undefined;

    if (!address) {
      inputError = <Trans>Connect Wallet</Trans>;
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      inputError = inputError ?? <Trans>Select a token</Trans>;
    }

    if (!parsedAmount) {
      inputError = inputError ?? <Trans>Enter an amount</Trans>;
    }

    const formattedTo = isAddress(to);
    if (!to || !formattedTo) {
      inputError = inputError ?? <Trans>Enter a recipient</Trans>;
    } else if (BAD_RECIPIENT_ADDRESSES[formattedTo]) {
      inputError = inputError ?? <Trans>Invalid recipient</Trans>;
    }

    const [balanceIn, amountIn] = [
      currencyBalances[Field.INPUT],
      trade.trade?.maximumAmountIn(new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE)),
    ];

    if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
      inputError = `Insufficient ${amountIn.currency.symbol} balance`;
    }

    if (trade.state === TradeState.LOADING) {
      inputError = (
        <Dots>
          <Trans>Fetching Trade</Trans>
        </Dots>
      );
    }
    return inputError;
  }, [address, allowedSlippage, currencies, currencyBalances, parsedAmount, to, trade]);

  return useMemo(
    () => ({
      currencies,
      currencyBalances,
      parsedAmount,
      inputError,
      trade: trade as any,
      allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
    }),
    [allowedSlippage, currencies, currencyBalances, inputError, parsedAmount, trade],
  );
}
