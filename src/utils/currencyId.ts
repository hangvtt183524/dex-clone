import { Currency, Token } from 'config/sdk-core';

export function currencyId(currency: Currency): string {
  if (currency?.isNative) return currency.symbol?.toUpperCase();
  if (currency?.isToken || (currency as Token).address) return (currency as Token).address;
  throw new Error('invalid currency');
}

export default currencyId;
