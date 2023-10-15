import { Currency, CurrencyAmount } from 'config/sdk-core';
import JSBI from 'jsbi';
import { getFullDecimals } from './numbersHelper';

function tryParseAmount<T extends Currency>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = getFullDecimals(value, currency.decimals).toString(10);

    if (typedValueParsed !== '0') {
      return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed));
    }
  } catch (error) {
    // fails if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  return undefined;
}

export default tryParseAmount;
