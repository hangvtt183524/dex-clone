import { useMemo } from 'react';
import { useMulticallContract } from 'hooks/useContract';
import orderBy from 'lodash/orderBy';

import { isAddress } from 'utils/addressHelpers';
import { IERC20 } from 'config/abis';
import { Currency, Token, CurrencyAmount } from 'config/sdk-core';
import JSBI from 'jsbi';
import { useMultipleContractSingleData, useSingleContractMultipleData } from 'state/multicall/hooks';
import { useAccount } from 'packages/wagmi/src';
import { useSelectedChainNetwork } from 'state/user/hooks';
import useNativeCurrency from './useNativeCurrency';
import { useAllTokens } from './Tokens';

export function useNativeBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined;
} {
  const native = useNativeCurrency();
  const multicallContract = useMulticallContract();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses ? orderBy(uncheckedAddresses.map(isAddress).filter((a): a is string => a !== false)) : [],
    [uncheckedAddresses],
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    useMemo(() => addresses.map((address) => [address]), [addresses]),
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0];
        if (value) memo[address] = CurrencyAmount.fromRawAmount(native, JSBI.BigInt(value.toString()));
        return memo;
      }, {}),
    [addresses, results, native],
  );
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[],
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens],
  );

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens]);

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    IERC20,
    'balanceOf',
    useMemo(() => [address], [address]),
  );

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances]);

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: CurrencyAmount<Token> | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              if (value) {
                memo[token.address] = CurrencyAmount.fromRawAmount(token, JSBI.BigInt(value?.toString()));
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances],
    ),
    anyLoading,
  ];
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[],
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies],
  );

    const chainId = useSelectedChainNetwork();

  const tokenBalances = useTokenBalances(account, tokens);

  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies]);
  const ethBalance = useNativeBalances(useMemo(() => (containsETH ? [account] : []), [containsETH, account]));

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency || currency.chainId !== chainId) return undefined;
        if (currency.isToken) return tokenBalances[currency.address];
        if (currency.isNative) return ethBalance[account];
        return undefined;
      }) ?? [],
    [account, chainId, currencies, ethBalance, tokenBalances],
  );
}

export function useCurrencyBalance(account?: string, token?: Currency): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(account, [token])[0];
}

// mimics useAllBalances
export function useAllTokenBalances(): {
  [tokenAddress: string]: CurrencyAmount<Currency> | undefined;
} {
  const { address } = useAccount();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens]);
  const balances = useTokenBalances(address ?? undefined, allTokensArray);
  return balances ?? {};
}
