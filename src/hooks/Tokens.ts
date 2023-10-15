/* eslint-disable no-param-reassign */
import { arrayify } from '@ethersproject/bytes';
import { parseBytes32String } from '@ethersproject/strings';
import { isSupportedChain } from 'config/constants/chains';
import { SupportedChainId, Currency, Token } from 'config/sdk-core';
import { TokenAddressMap } from 'config/types/lists';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { deserializeToken } from 'utils/tokens';
import { isAddress } from 'utils/addressHelpers';
import useUserAddedTokens from 'state/user/useUserAddedTokens';
import {
  BASES_TO_CHECK_TRADES_AGAINST,
  ADDITIONAL_BASES,
  CUSTOM_BASES,
  TOKEN_SHORTHANDS,
  NATIVE_TOKEN,
} from 'config/tokens';
import { NEVER_RELOAD, useSingleCallResult } from 'state/multicall/hooks';

import { useSelectedChainNetwork } from 'state/user/hooks';
import {
  combinedTokenMapFromActiveUrlsAtom,
  combinedTokenMapFromOfficialsUrlsAtom,
  useUnsupportedTokenList,
  useWarningTokenList,
} from '../state/lists/hooks';
import { useBytes32TokenContract, useTokenContract } from './useContract';
import useNativeCurrency from './useNativeCurrency';
import useActiveWeb3React from './web3React/useActiveWeb3React';

const mapWithoutUrls = (tokenMap: TokenAddressMap, chainId: number) =>
  Object.keys(tokenMap[chainId] || {}).reduce<{ [address: string]: Token }>((newMap, address) => {
    const { token } = tokenMap[chainId][address];
    newMap[address?.toLowerCase()] = new Token(token.chainId, token.address, token.decimals, token.symbol, token.name);
    return newMap;
  }, {});

/**
 * Returns all tokens that are from active urls and user added tokens
 */
export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React();

  const tokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom);

  const userAddedTokens = useUserAddedTokens();
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>((tokenMap_, token) => {
          tokenMap_[token.address?.toLowerCase()] = new Token(
            token.chainId,
            token.address,
            token.decimals,
            token.symbol,
            token.name,
          );
          return tokenMap_;
        }, mapWithoutUrls(tokenMap, chainId))
    );
  }, [userAddedTokens, tokenMap, chainId]);
}

export function useTokenInfoFromActiveList(currency: Currency) {
  const chainId = useSelectedChainNetwork();

  const tokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom);

  return useMemo(() => {
    if (!chainId) return;
    if (currency.isNative) return currency;

    try {
      return tokenMap[chainId][currency.wrapped.address].token;
    } catch (e) {
      return currency;
    }
  }, [tokenMap, chainId, currency]);
}

export function useAllCurrencyCombinations(currencyA?: Currency, currencyB?: Currency): [Token, Token][] {
  const chainId = currencyA?.chainId;

  const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined];

  const bases: Token[] = useMemo(() => {
    if (!chainId || chainId !== tokenB?.chainId) return [];

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? [];
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : [];
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : [];

    return [...common, ...additionalA, ...additionalB];
  }, [chainId, tokenA, tokenB]);

  const basePairs: [Token, Token][] = useMemo(
    () =>
      bases
        .flatMap((base): [Token, Token][] => bases.map((otherBase) => [base, otherBase]))
        // though redundant with the first filter below, that expression runs more often, so this is probably worthwhile
        .filter(([t0, t1]) => t0 && !t0.equals(t1)),
    [bases],
  );

  return useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB] as [Token, Token],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs,
          ]
            // filter out invalid pairs comprised of the same asset (e.g. WETH<>WETH)
            .filter(([t0, t1]) => !t0.equals(t1))
            // filter out duplicate pairs
            .filter(([t0, t1], i, otherPairs) => {
              // find the first index in the array at which there are the same 2 tokens as the current
              const firstIndexInOtherPairs = otherPairs.findIndex(([t0Other, t1Other]) => {
                return (t0.equals(t0Other) && t1.equals(t1Other)) || (t0.equals(t1Other) && t1.equals(t0Other));
              });
              // only accept the first occurrence of the same 2 tokens
              return firstIndexInOtherPairs === i;
            })
            // optionally filter out some pairs for tokens with custom bases defined
            .filter(([tokenA, tokenB]) => {
              if (!chainId) return true;
              const customBases = CUSTOM_BASES[chainId];

              const customBasesA: Token[] | undefined = customBases?.[tokenA.address];
              const customBasesB: Token[] | undefined = customBases?.[tokenB.address];

              if (!customBasesA && !customBasesB) return true;

              if (customBasesA && !customBasesA.find((base) => tokenB.equals(base))) return false;
              if (customBasesB && !customBasesB.find((base) => tokenA.equals(base))) return false;

              return true;
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId],
  );
}

/**
 * Returns all tokens that are from officials token list and user added tokens
 */
export function useOfficialsAndUserAddedTokens(): { [address: string]: Token } {
  const chainId = useSelectedChainNetwork();

  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom);
  const userAddedTokens = useUserAddedTokens();
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap_, token) => {
            tokenMap_[token.address] = token;
            return tokenMap_;
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    );
  }, [userAddedTokens, tokenMap, chainId]);
}

export function useUnsupportedTokens(): { [address: string]: Token } {
  const chainId = useSelectedChainNetwork();

  const unsupportedTokensMap = useUnsupportedTokenList();
  return useMemo(() => mapWithoutUrls(unsupportedTokensMap, chainId), [unsupportedTokensMap, chainId]);
}

export function useWarningTokens(): { [address: string]: Token } {
  const warningTokensMap = useWarningTokenList();
  const chainId = useSelectedChainNetwork();

  return useMemo(() => mapWithoutUrls(warningTokensMap, chainId), [warningTokensMap, chainId]);
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens();

  if (!activeTokens || !token) {
    return false;
  }

  return !!activeTokens[token.address];
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Token | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens();
  if (!currency) {
    return false;
  }

  return !!userAddedTokens.find((token) => currency?.equals(token));
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const chainId = useSelectedChainNetwork();

  const formattedAddress = isAddress(tokenAddress);
  const tokenContract = useTokenContract(formattedAddress ? tokenAddress : undefined, false);

  const tokenContractBytes32 = useBytes32TokenContract(formattedAddress ? tokenAddress : undefined, false);

  // TODO: Fix redux-multicall so that these values do not reload.
  const tokenName = useSingleCallResult(tokenContract, 'name', undefined, NEVER_RELOAD);

  const tokenNameBytes32 = useSingleCallResult(tokenContractBytes32, 'name', undefined, NEVER_RELOAD);
  const symbol = useSingleCallResult(tokenContract, 'symbol', undefined, NEVER_RELOAD);
  const symbolBytes32 = useSingleCallResult(tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD);
  const decimals = useSingleCallResult(tokenContract, 'decimals', undefined, NEVER_RELOAD);

  const isLoading = useMemo(
    () => decimals.loading || symbol.loading || tokenName.loading,
    [decimals.loading, symbol.loading, tokenName.loading],
  );
  const parsedDecimals = useMemo(() => decimals?.result?.[0], [decimals.result]);

  const parsedSymbol = useMemo(
    () => parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
    [symbol.result, symbolBytes32.result],
  );
  const parsedName = useMemo(
    () => parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token'),
    [tokenName.result, tokenNameBytes32.result],
  );

  return useMemo(() => {
    // If the token is on another chain, we cannot fetch it on-chain, and it is invalid.
    if (typeof tokenAddress !== 'string' || !isSupportedChain(chainId) || !formattedAddress) return undefined;
    if (isLoading || !chainId || (!parsedDecimals && parsedSymbol === 'UNKNOWN' && parsedName === 'Unknown Token'))
      return null;

    return new Token(chainId, tokenAddress, parsedDecimals, parsedSymbol, parsedName);
  }, [chainId, tokenAddress, formattedAddress, isLoading, parsedDecimals, parsedSymbol, parsedName]);
}

export function useTokenFromMapOrNetwork(
  tokens: TokenAddressMap,
  tokenAddress?: string | null,
): Token | null | undefined {
  const formatAddress = useMemo(
    () => (isAddress(tokenAddress) && tokenAddress ? tokenAddress?.toLowerCase() : undefined),
    [tokenAddress],
  );

  const token: Token | undefined = formatAddress ? deserializeToken(tokens[tokenAddress?.toLowerCase()]) : undefined;
  const tokenFromNetwork = useToken(token ? undefined : formatAddress);

  return useMemo(() => tokenFromNetwork ?? token, [tokenFromNetwork, token]);
}
export function useCurrencyFromMap(tokens: TokenAddressMap, currencyId?: string | null): Currency | null | undefined {
  const chainId = useSelectedChainNetwork();

  const nativeCurrency = useNativeCurrency();
  const isNative = Boolean(
    nativeCurrency && NATIVE_TOKEN?.[chainId]?.symbol?.toLowerCase() === currencyId?.toLowerCase(),
  );

  const shorthandMatchAddress = useMemo(() => {
    return chainId && currencyId ? TOKEN_SHORTHANDS[currencyId]?.[chainId] : undefined;
  }, [chainId, currencyId]);

  const token = useTokenFromMapOrNetwork(tokens, isNative ? undefined : shorthandMatchAddress ?? currencyId);

  if (currencyId === null || currencyId === undefined || !isSupportedChain(chainId)) return null;
  // this case so we use our builtin wrapped token instead of wrapped tokens on token lists
  const wrappedNative = nativeCurrency?.wrapped;

  if (wrappedNative?.address?.toLowerCase() === currencyId?.toLowerCase()) return wrappedNative;
  return isNative ? nativeCurrency : token;
}

export function useCurrency(currencyId?: string | null): Currency | null | undefined {
  const tokens = useAllTokens();
  return useCurrencyFromMap(tokens, currencyId);
}
