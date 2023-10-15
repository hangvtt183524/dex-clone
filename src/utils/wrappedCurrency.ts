import { Native } from 'config/native';
import { SupportedChainId, Currency, CurrencyAmount, Token } from 'config/sdk-core';
import { WRAPPED_NATIVE_CURRENCY } from 'config/tokens';

export const wrappedCurrency = (
  currency: Token | undefined,
  chainId: SupportedChainId | undefined,
): Token | undefined => {
  return chainId && currency?.isNative ? WRAPPED_NATIVE_CURRENCY[chainId] : currency?.address ? currency : undefined;
};

export const wrappedCurrencyAmount = (
  currencyAmount: CurrencyAmount<Token> | undefined,
  chainId: SupportedChainId | undefined,
): CurrencyAmount<Token> | undefined => {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined;
  return token && currencyAmount ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient) : undefined;
};

export const unwrappedToken = (token: Token): Currency => {
  if (token.equals(WRAPPED_NATIVE_CURRENCY[token.chainId])) return Native.onChain(token.chainId);
  return token;
};
