import { BIPS_BASE } from 'config/constants/number';
import { CurrencyAmount, Percent, Fraction, Currency } from 'config/sdk-core';
import JSBI from 'jsbi';

const ONE = new Fraction(1, 1);

export function calculateSlippageAmount(value: CurrencyAmount<Currency>, slippage: Percent): [JSBI, JSBI] {
  if (slippage.lessThan(0) || slippage.greaterThan(ONE)) throw new Error('Unexpected slippage');
  return [value.multiply(ONE.subtract(slippage)).quotient, value.multiply(ONE.add(slippage)).quotient];
}

export const parseSlippagePercent = (slippage: number | string) => new Percent(JSBI.BigInt(slippage), BIPS_BASE);
