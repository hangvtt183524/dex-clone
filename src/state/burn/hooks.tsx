import { JSBI_ZERO } from 'config/constants/number';
import { Currency, Percent, CurrencyAmount, Token, Price } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { PairState, useV2Pair } from 'hooks/pool/useV2Pairs';
import { useTokenBalances } from 'hooks/useBalances';
import { useTotalSupply } from 'hooks/useTotalSupply';
import JSBI from 'jsbi';
import { Trans } from 'react-i18next';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from 'state/store';
import tryParseAmount from 'utils/tryParseAmount';
import { useAccount } from 'packages/wagmi/src';
import { FieldBurn, typeInput } from './actions';

export function useBurnState() {
  return useAppSelector((state) => state.burn);
}

export function useDerivedBurnInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  pair?: Pair | null;
  price?: Price<Currency, Currency>;
  parsedAmounts: {
    [FieldBurn.LIQUIDITY_PERCENT]: Percent;
    [FieldBurn.LIQUIDITY]?: CurrencyAmount<Token>;
    [FieldBurn.CURRENCY_A]?: CurrencyAmount<Currency>;
    [FieldBurn.CURRENCY_B]?: CurrencyAmount<Currency>;
  };
  error?: ReactNode;
} {
  const { address } = useAccount();

  const { independentField, typedValue } = useBurnState();

  // pair + totalsupply
  const [pairState, pair] = useV2Pair(currencyA, currencyB);

  // balances
  const relevantTokenBalances = useTokenBalances(address ?? undefined, [pair?.liquidityToken]);
  const userLiquidity: undefined | CurrencyAmount<Token> = relevantTokenBalances?.[pair?.liquidityToken?.address ?? ''];

  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped];
  const tokens = {
    [FieldBurn.CURRENCY_A]: tokenA,
    [FieldBurn.CURRENCY_B]: tokenB,
    [FieldBurn.LIQUIDITY]: pair?.liquidityToken,
  };

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken);
  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.quotient, userLiquidity.quotient)
      ? CurrencyAmount.fromRawAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).quotient)
      : undefined;
  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.quotient, userLiquidity.quotient)
      ? CurrencyAmount.fromRawAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).quotient)
      : undefined;
  const liquidityValues: {
    [FieldBurn.CURRENCY_A]?: CurrencyAmount<Token>;
    [FieldBurn.CURRENCY_B]?: CurrencyAmount<Token>;
  } = {
    [FieldBurn.CURRENCY_A]: liquidityValueA,
    [FieldBurn.CURRENCY_B]: liquidityValueB,
  };

  let percentToRemove: Percent = useMemo(() => new Percent('0', '100'), []);

  // user specified a %
  if (independentField === FieldBurn.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100');
  }
  // user specified a specific amount of liquidity tokens
  else if (independentField === FieldBurn.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken);
      if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
        percentToRemove = new Percent(independentAmount.quotient, userLiquidity.quotient);
      }
    }
  }
  // user specified a specific amount of token a or b
  else if (tokens[independentField]) {
    const independentAmount = tryParseAmount(typedValue, tokens[independentField]);
    const liquidityValue = liquidityValues[independentField];
    if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
      percentToRemove = new Percent(independentAmount.quotient, liquidityValue.quotient);
    }
  }

  const parsedAmounts: {
    [FieldBurn.LIQUIDITY_PERCENT]: Percent;
    [FieldBurn.LIQUIDITY]?: CurrencyAmount<Token>;
    [FieldBurn.CURRENCY_A]?: CurrencyAmount<Currency>;
    [FieldBurn.CURRENCY_B]?: CurrencyAmount<Currency>;
  } = useMemo(
    () => ({
      [FieldBurn.LIQUIDITY_PERCENT]: percentToRemove,
      [FieldBurn.LIQUIDITY]:
        userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
          ? CurrencyAmount.fromRawAmount(
              userLiquidity.currency,
              percentToRemove.multiply(userLiquidity.quotient).quotient,
            )
          : undefined,
      [FieldBurn.CURRENCY_A]:
        tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
          ? CurrencyAmount.fromRawAmount(tokenA, percentToRemove.multiply(liquidityValueA.quotient).quotient)
          : undefined,
      [FieldBurn.CURRENCY_B]:
        tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
          ? CurrencyAmount.fromRawAmount(tokenB, percentToRemove.multiply(liquidityValueB.quotient).quotient)
          : undefined,
    }),
    [liquidityValueA, liquidityValueB, percentToRemove, tokenA, tokenB, userLiquidity],
  );
  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(totalSupply && JSBI.equal(totalSupply.quotient, JSBI_ZERO)) ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.quotient, JSBI_ZERO) &&
        JSBI.equal(pair.reserve1.quotient, JSBI_ZERO),
    );

  const price = useMemo(() => {
    if (noLiquidity) {
      const { [FieldBurn.CURRENCY_A]: currencyAAmount, [FieldBurn.CURRENCY_B]: currencyBAmount } = parsedAmounts;
      if (currencyAAmount?.greaterThan(0) && currencyBAmount?.greaterThan(0)) {
        const value = currencyBAmount.divide(currencyAAmount);
        return new Price(currencyAAmount.currency, currencyBAmount.currency, value.denominator, value.numerator);
      }
      return undefined;
    }
    const wrappedCurrencyA = currencyA?.wrapped;

    return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined;
  }, [currencyA, noLiquidity, pair, parsedAmounts]);

  let error: ReactNode | undefined;
  if (!address) {
    error = <Trans>Connect Wallet</Trans>;
  }

  if (
    !parsedAmounts[FieldBurn.LIQUIDITY] ||
    !parsedAmounts[FieldBurn.CURRENCY_A] ||
    !parsedAmounts[FieldBurn.CURRENCY_B] ||
    parsedAmounts[FieldBurn.CURRENCY_B]?.equalTo(0) ||
    parsedAmounts[FieldBurn.CURRENCY_A]?.equalTo(0) ||
    parsedAmounts[FieldBurn.LIQUIDITY]?.equalTo(0)
  ) {
    error = error ?? <Trans>Enter an amount</Trans>;
  }

  return { pair, parsedAmounts, error, price };
}

export function useBurnActionHandlers(): {
  onUserInput: (field: FieldBurn, typedValue: string) => void;
} {
  const dispatch = useAppDispatch();

  const onUserInput = useCallback(
    (field: FieldBurn, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }));
    },
    [dispatch],
  );

  return {
    onUserInput,
  };
}
