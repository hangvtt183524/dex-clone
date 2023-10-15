import { CHAIN_ID } from 'config/env';
import { DEFAULT_TOKEN_LIST } from 'config/lists';
import { SupportedChainId, Currency, CurrencyAmount, Token } from 'config/sdk-core';
import { TOKENS, TOKENS_BY_ADDRESS_MAP } from 'config/tokens';
import { TokenByChain } from 'config/types/token';
import { deserializeToken } from 'utils/tokens';
import { Rounding } from 'config/constants/number';

export const mapTokenFromListDefault = (chainId: SupportedChainId = CHAIN_ID) => {
  const tokens = DEFAULT_TOKEN_LIST.tokens.filter((token) => token.chainId === chainId);
  if (tokens.length === 0) return {};
  return tokens.reduce((state, token) => {
    if (!token) return state;
    state[token.symbol] = deserializeToken(token);
    return state;
  }, {});
};

export const mapTokensWithSymbolToAllChain = (key: string) => {
  return Object.values(SupportedChainId).reduce((state, chainId) => {
    const token = TOKENS[chainId]?.[key] || null;
    if (token) state[chainId] = deserializeToken(token);
    return state;
  }, {}) as TokenByChain;
};

export const mapTokensWithSymbolsToAllChain = (keys: string[]) => {
  return Object.values(SupportedChainId).reduce((state, chainId) => {
    keys.forEach((key) => {
      if (!state[chainId]) {
        state[chainId] = [];
      }
      const token = TOKENS[chainId]?.[key] || null;
      if (token) state[chainId].push(deserializeToken(token));
    });
    return state;
  }, {}) as {
    [key in SupportedChainId]: Token[];
  };
};

export const displaySignificantSymbol = (
  CurrencyAmount: CurrencyAmount<Currency>,
  significantDigits,
  format?: object,
  rounding: Rounding = Rounding.ROUND_DOWN,
): string => {
  return `${CurrencyAmount.toSignificant(significantDigits, format, rounding)} ${CurrencyAmount.currency.symbol}`;
};

export const getTokenByAddressInChain = (chainId: SupportedChainId, address: string) => {
    return TOKENS_BY_ADDRESS_MAP[chainId] ?
        address ? TOKENS_BY_ADDRESS_MAP[chainId][address.toLowerCase()] : TOKENS_BY_ADDRESS_MAP[chainId]['0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce']
        : null
    ;
}
