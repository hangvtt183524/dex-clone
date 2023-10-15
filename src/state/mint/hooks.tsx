import { JSBI_ZERO } from 'config/constants/number';
import { Currency, CurrencyAmount, Percent, Price, Token } from 'config/sdk-core';
import tryParseAmount from 'utils/tryParseAmount';
import { Pair } from 'config/v2-sdk';
import { PairState, useV2Pair } from 'hooks/pool/useV2Pairs';
import { useCurrency } from 'hooks/Tokens';
import { useCurrencyBalances } from 'hooks/useBalances';
import { useTotalSupply } from 'hooks/useTotalSupply';
import JSBI from 'jsbi';
import React, { ReactNode, useMemo } from 'react';
import { useAppSelector } from 'state/store';
import { Trans } from 'react-i18next';
import { useAccount } from 'packages/wagmi/src';
import { FieldMint } from './actions';

export const useMintState = () => useAppSelector((state) => state.mint);

export const useInfoMintState = (): {
  currencies: { [field in FieldMint]?: Currency };
  parsedTypedAmounts: { [field in FieldMint]?: CurrencyAmount<Currency> };
} => {
  const {
    [FieldMint.INPUT]: { currencyId: inputTokenId },
    [FieldMint.OUTPUT]: { currencyId: outputTokenId },
    typedValue,
    otherTypedValue,
  } = useMintState();

  const inputToken = useCurrency(inputTokenId);
  const outputToken = useCurrency(outputTokenId);

  const currencies: { [field in FieldMint]?: Currency } = {
    [FieldMint.INPUT]: inputToken ?? undefined,
    [FieldMint.OUTPUT]: outputToken ?? undefined,
  };

  const parsedTypedAmounts = {
    [FieldMint.INPUT]: tryParseAmount(typedValue, currencies[FieldMint.INPUT]),
    [FieldMint.OUTPUT]: tryParseAmount(otherTypedValue, currencies[FieldMint.OUTPUT]),
  };

  return {
    currencies,
    parsedTypedAmounts,
  };
};

export function useDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  dependentField: FieldMint;
  currencies: { [field in FieldMint]?: Currency };
  pair?: Pair | null;
  pairState: PairState;
  currencyBalances: { [field in FieldMint]?: CurrencyAmount<Currency> };
  parsedAmounts: { [field in FieldMint]?: CurrencyAmount<Currency> };
  price?: Price<Currency, Currency>;
  noLiquidity?: boolean;
  liquidityMinted?: CurrencyAmount<Token>;
  poolTokenPercentage?: Percent;
  error?: ReactNode;
} {
  const { address } = useAccount();

  const { independentField, typedValue, otherTypedValue } = useMintState();
  const dependentField = independentField === FieldMint.INPUT ? FieldMint.OUTPUT : FieldMint.INPUT;

  // tokens
  const currencies: { [field in FieldMint]?: Currency } = useMemo(
    () => ({
      [FieldMint.INPUT]: currencyA ?? undefined,
      [FieldMint.OUTPUT]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  );

  // pair
  const [pairState, pair] = useV2Pair(currencies[FieldMint.INPUT], currencies[FieldMint.OUTPUT]);
  const totalSupply = useTotalSupply(pair?.liquidityToken);
  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(totalSupply && JSBI.equal(totalSupply.quotient, JSBI_ZERO)) ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.quotient, JSBI_ZERO) &&
        JSBI.equal(pair.reserve1.quotient, JSBI_ZERO),
    );

  // balances
  const balances = useCurrencyBalances(
    address ?? undefined,
    useMemo(() => [currencies[FieldMint.INPUT], currencies[FieldMint.OUTPUT]], [currencies]),
  );
  const currencyBalances: { [field in FieldMint]?: CurrencyAmount<Currency> } = {
    [FieldMint.INPUT]: balances[0],
    [FieldMint.OUTPUT]: balances[1],
  };

  // amounts
  const independentAmount: CurrencyAmount<Currency> | undefined = tryParseAmount(
    typedValue,
    currencies[independentField],
  );

  const dependentAmount: CurrencyAmount<Currency> | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField]);
      }
      return undefined;
    }
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = independentAmount?.wrapped;
      const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped];
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency = dependentField === FieldMint.OUTPUT ? currencyB : currencyA;
        const dependentTokenAmount =
          dependentField === FieldMint.OUTPUT
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount);

        return dependentCurrency?.isNative
          ? CurrencyAmount.fromRawAmount(dependentCurrency, dependentTokenAmount.quotient)
          : dependentTokenAmount;
      }
      return undefined;
    }
    return undefined;
  }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, currencyA, currencyB, pair]);

  const parsedAmounts: {
    [field in FieldMint]: CurrencyAmount<Currency> | undefined;
  } = useMemo(() => {
    return {
      [FieldMint.INPUT]: independentField === FieldMint.INPUT ? independentAmount : dependentAmount,
      [FieldMint.OUTPUT]: independentField === FieldMint.INPUT ? dependentAmount : independentAmount,
    };
  }, [dependentAmount, independentAmount, independentField]);

  const price = useMemo(() => {
    if (noLiquidity) {
      const { [FieldMint.INPUT]: currencyAAmount, [FieldMint.OUTPUT]: currencyBAmount } = parsedAmounts;
      if (currencyAAmount?.greaterThan(0) && currencyBAmount?.greaterThan(0)) {
        const value = currencyBAmount.divide(currencyAAmount);
        return new Price(currencyAAmount.currency, currencyBAmount.currency, value.denominator, value.numerator);
      }
      return undefined;
    }
    const wrappedCurrencyA = currencyA?.wrapped;

    return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined;
  }, [currencyA, noLiquidity, pair, parsedAmounts]);

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [FieldMint.INPUT]: currencyAAmount, [FieldMint.OUTPUT]: currencyBAmount } = parsedAmounts;
    const [tokenAmountA, tokenAmountB] = [currencyAAmount?.wrapped, currencyBAmount?.wrapped];
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB);
      } catch (error) {
        console.error(error);
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [parsedAmounts, pair, totalSupply]);

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.quotient, totalSupply.add(liquidityMinted).quotient);
    }
    return undefined;
  }, [liquidityMinted, totalSupply]);

  let error: ReactNode | undefined;
  if (!address) {
    error = <Trans>Connect Wallet</Trans>;
  }

  if (pairState === PairState.INVALID) {
    error = error ?? <Trans>Invalid pair</Trans>;
  }

  if (!parsedAmounts[FieldMint.INPUT] || !parsedAmounts[FieldMint.OUTPUT]) {
    error = error ?? <Trans>Enter an amount</Trans>;
  }

  const { [FieldMint.INPUT]: currencyAAmount, [FieldMint.OUTPUT]: currencyBAmount } = parsedAmounts;

  if (currencyAAmount && currencyBalances?.[FieldMint.INPUT]?.lessThan(currencyAAmount)) {
    error = <Trans>Insufficient {currencies[FieldMint.INPUT]?.symbol} balance</Trans>;
  }

  if (currencyBAmount && currencyBalances?.[FieldMint.OUTPUT]?.lessThan(currencyBAmount)) {
    error = <Trans>Insufficient {currencies[FieldMint.OUTPUT]?.symbol} balance</Trans>;
  }

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  };
}
