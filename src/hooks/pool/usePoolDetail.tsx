/* eslint-disable react-hooks/rules-of-hooks */
import { JSBI_ZERO } from 'config/constants/number';
import { CurrencyAmount, Token, Percent, Currency } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { useTokenBalance } from 'hooks/useBalances';
import { useTotalSupply } from 'hooks/useTotalSupply';
import JSBI from 'jsbi';
import { useAccount } from 'packages/wagmi/src';
import { useMemo } from 'react';
import { unwrappedToken } from 'utils/wrappedCurrency';

export const usePoolDetail = ({
  pair,
  stakedBalance,
  showUnwrapped,
}: {
  pair: Pair;
  stakedBalance?: CurrencyAmount<Token>;
  showUnwrapped?: boolean;
}): {
  currency0: Currency;
  currency1: Currency;
  userPoolBalance: CurrencyAmount<Token>;
  userDefaultPoolBalance: CurrencyAmount<Token>;
  poolTokenPercentage: Percent;
  token0Deposited: CurrencyAmount<Token>;
  token1Deposited: CurrencyAmount<Token>;
} => {
  if (!pair)
    return {
      currency0: null,
      currency1: null,
      userPoolBalance: null,
      userDefaultPoolBalance: null,
      poolTokenPercentage: null,
      token0Deposited: null,
      token1Deposited: null,
    };

  const { address } = useAccount();
  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const userDefaultPoolBalance = useTokenBalance(address ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance;

  const poolTokenPercentage = useMemo(
    () =>
      !!userPoolBalance &&
      !!totalPoolTokens &&
      JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
        ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
        : undefined,
    [totalPoolTokens, userPoolBalance],
  );

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    userPoolBalance?.greaterThan(JSBI_ZERO) &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return useMemo(
    () => ({
      currency0,
      currency1,
      userPoolBalance,
      userDefaultPoolBalance,
      poolTokenPercentage,
      token0Deposited,
      token1Deposited,
    }),
    [
      currency0,
      currency1,
      poolTokenPercentage,
      token0Deposited,
      token1Deposited,
      userDefaultPoolBalance,
      userPoolBalance,
    ],
  );
};
