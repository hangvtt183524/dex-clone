import BigNumber from 'bignumber.js';
import { DEFAULT_LOCALE } from 'config/constants/locales';
import { BigintIsh, BIG_TEN, BIG_ZERO, Rounding, unitsEther } from 'config/constants/number';
import { Currency, CurrencyAmount, Percent, Price } from 'config/sdk-core';
import JSBI from 'jsbi';
import numbro from 'numbro';

/* JSBI */

const SUBSCRIPT_DIGITS = '₀₁₂₃₄₅₆₇₈₉';

export default function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString);
}

export const delineate = (amount: string, decimalsTake?: number, wrapZeroType?: 'html' | 'plain') => {
  const parts = amount.split('.');
  if (amount.toUpperCase() === 'NAN') return '';

  let formatDecimal = '';
  if (decimalsTake && parts[1] && Number(parts[1])) {
    formatDecimal = parts[1].substring(0, decimalsTake);
    if (wrapZeroType) {
      formatDecimal = wrapZeroToSubscript(formatDecimal, wrapZeroType);
    }
    formatDecimal = `.${formatDecimal}`;
  }

  return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + formatDecimal;
};

// plain type may cause subscript digits display as serif font.
const wrapZeroToSubscript = (value: string, type: 'html' | 'plain', minimumAllow = 3) => {
  let count = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== '0') {
      if (count < minimumAllow) {
        return value;
      }
      let subSymbol;
      if (type === 'html') {
        subSymbol = `<sub>${count}</sub>`;
      } else {
        subSymbol = [...String(count)].reduce((num, val) => num + SUBSCRIPT_DIGITS[Number(val)], '');
      }
      return `0${subSymbol}${value.substring(i)}`;
    }
    count++;
  }
};

/**
 * Convert 10.999 to 10999000
 */
export const getFullDecimals = (amount: string | number | BigNumber, decimals: number): BigNumber => {
  const raw = new BigNumber(amount?.toString(10));
  const base = new BigNumber(10);
  const decimalsBN = new BigNumber(decimals);
  return raw.times(base.pow(decimalsBN)).integerValue();
};

/**
 * Convert 10999000 to 10.999
 */
export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber();
};

export const parseNumberDisplay = (value: BigNumber, fixed: number, decimals: number) => {
  const parsedValue = getBalanceAmount(value, decimals).toString(10);
  return delineate(
    Number(parsedValue) ? parsedValue : getBalanceAmount(value, decimals).toString(10),
    fixed,
  ).toString();
};

export function secondsToDeadline(deadline: BigNumber): BigNumber {
  return new BigNumber(deadline).plus(new BigNumber(Date.now() / 1000)).integerValue(Rounding.ROUND_DOWN);
}
export const sqrt = (value: BigNumber): BigNumber =>
  new BigNumber(new BigNumber(value.toString()).sqrt().toFixed().split('.')[0]);

export const checkBN = (val: BigNumber, defaultBN: BigNumber = BIG_ZERO) => {
  if (!val) return defaultBN;
  if (val.isNaN()) return defaultBN;
  return val;
};
export function parseBigintIsh(bigintIsh: BigintIsh): JSBI {
  return bigintIsh instanceof JSBI ? bigintIsh : JSBI.BigInt(bigintIsh);
}

/*
  with slippage
  10000 = 100%
*/
export const formatDisplaySlipageNumber = (slippage: string | number) => parseFloat(slippage.toString()) / 100;
export const formatSlipageNumber = (slippage: string | number) => parseFloat(slippage.toString()) * 100;

export const MAX_SAFE_INTEGER = JSBI.BigInt(Number.MAX_SAFE_INTEGER);

// Convert [Price] to number with necessary precision for price formatting.
export const priceToPreciseFloat = (price: Price<Currency, Currency> | undefined) => {
  if (!price) return undefined;
  const floatForLargerNumbers = new BigNumber(price.toFixed(18));
  if (floatForLargerNumbers.lt(0.1)) {
    return Number(price.toSignificant(6));
  }

  return floatForLargerNumbers.toNumber();
};

interface FormatDollarArgs {
  num: number | undefined | null;
  isPrice?: boolean;
  lessPreciseStablecoinValues?: boolean;
  digits?: number;
  round?: boolean;
}

/**
 * Returns a USD dollar or equivalent denominated numerical value formatted
 * in human readable string for use in template.
 *
 * Adheres to guidelines for prices and other numbers defined here:
 * https://www.notion.so/uniswaplabs/Number-standards-fbb9f533f10e4e22820722c2f66d23c0
 * @param num numerical value denominated in USD or USD equivalent
 * @param isPrice whether the amount represents a price or not
 * @param lessPreciseStablecoinValues whether or not we should show less precise values for
 * stablecoins (around 1$ in value always) for the sake of readability
 * @param digits number of digits after the decimal for non-price amounts
 * @param round whether or not to round up non-price amounts
 */
export const formatDollar = ({
  num,
  isPrice = false,
  lessPreciseStablecoinValues = false,
  digits = 2,
  round = true,
}: FormatDollarArgs): string => {
  // For USD dollar denominated prices.
  if (isPrice) {
    if (num === 0) return '$0.00';
    if (!num) return '-';
    if (num < 0.000001) {
      return `$${num.toExponential(2)}`;
    }
    if ((num >= 0.000001 && num < 0.1) || num > 1000000) {
      return `$${Number(num).toPrecision(3)}`;
    }
    // We only show 2 decimal places in explore table for stablecoin value ranges
    // for the sake of readability (as opposed to the usual 3 elsewhere).
    if (num >= 0.1 && num < (lessPreciseStablecoinValues ? 0.9995 : 1.05)) {
      return `$${num.toFixed(3)}`;
    }
    return `$${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, {
      minimumFractionDigits: 2,
    })}`;
  }
  // For volume dollar amounts, like market cap, total value locked, etc.

  if (num === 0) return '$0.00';
  if (!num) return '-';
  if (num < 0.000001) {
    return '$<0.000001';
  }
  if (num >= 0.000001 && num < 0.1) {
    return `$${Number(num).toPrecision(3)}`;
  }
  if (num >= 0.1 && num < 1.05) {
    return `$${num.toFixed(3)}`;
  }

  return numbro(num)
    .formatCurrency({
      average: round,
      mantissa: num > 1000 ? 2 : digits,
      abbreviations: {
        million: 'M',
        billion: 'B',
      },
    })
    .toUpperCase();
};

/**
 * Returns a numerical amount of any token formatted in human readable string for use in template.
 *
 * For transaction review numbers, such as token quantities, NFT price (token-denominated),
 *  network fees, transaction history items. Adheres to guidelines defined here:
 * https://www.notion.so/uniswaplabs/Number-standards-fbb9f533f10e4e22820722c2f66d23c0
 * @param num numerical value denominated in any token
 * @param maxDigits the maximum number of digits that should be shown for the quantity
 */
export const formatTransactionAmount = (num: number | undefined | null, maxDigits = 9) => {
  if (num === 0) return '0.00';
  if (!num) return '';
  if (num < 0.00001) {
    return '<0.00001';
  }
  if (num >= 0.00001 && num < 1) {
    return `${Number(num.toFixed(5)).toLocaleString(DEFAULT_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    })}`;
  }
  if (num >= 1 && num < 10000) {
    return `${Number(num.toPrecision(6)).toLocaleString(DEFAULT_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  }
  if (num >= 10000 && num < 1000000) {
    return `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, {
      minimumFractionDigits: 2,
    })}`;
  }
  // For very large numbers, switch to scientific notation and show as much precision
  // as permissible by maxDigits param.
  if (num >= 10 ** (maxDigits - 1)) {
    return `${delineate(num.toString(10), maxDigits)}`;
  }
  return `${Number(num.toFixed(2)).toLocaleString(DEFAULT_LOCALE, {
    minimumFractionDigits: 2,
  })}`;
};

// Convert [CurrencyAmount] to number with necessary precision for price formatting.
export const currencyAmountToPreciseFloat = (currencyAmount: CurrencyAmount<Currency> | undefined) => {
  if (!currencyAmount) return undefined;
  const floatForLargerNumbers = new BigNumber(currencyAmount.toExact());
  // if (floatForLargerNumbers.lt(0.1)) {
  //   return currencyAmount.toSignificant(6).toString();
  // }
  return floatForLargerNumbers.toString(10);
};

export const formatPercentInBasisPointsNumber = (percent: Percent): number => parseFloat(percent.toFixed(2)) * 100;

export const formatPercentNumber = (percent: Percent): number => parseFloat(percent.toFixed(2));

export const getPriceUpdateBasisPoints = (
  prevPrice: Price<Currency, Currency>,
  newPrice: Price<Currency, Currency>,
): number => {
  const changeFraction = newPrice.subtract(prevPrice).divide(prevPrice);
  const changePercentage = new Percent(changeFraction.numerator, changeFraction.denominator);
  return formatPercentInBasisPointsNumber(changePercentage);
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatLocalNumber = (number: number, digits = 2): string => {
  return new Intl.NumberFormat('US-us', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: digits,
  }).format(number);
};

export const formatUSDPriceWithCommas = (price: number) => {
  return `$${Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const isNaNZero = (val: string | number | BigNumber) => {
  const parseBN = new BigNumber(val.toString());
  return parseBN.isNaN() || parseBN.isZero() || parseBN.lt(0);
};
export const formatLocalisedCompactNumber = (number: number): string => {
  // const codeFromStorage = getLanguageCodeFromLS();
  //   const TenThousand = 1e4;
  // const OneMillion = 1e6;
  // const OneBillion = 1e9;
  // const TenBillion = 1e10;
  // const OneTrillion = 1e12;
  // const OneQuadrillion = 1e15;

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: 2,
  }).format(number);
};

export const displayBalanceEthValue = (
  _value: BigNumber | string | number,
  wrapZeroType?: 'html' | 'plain',
): string => {
  const value = new BigNumber(_value);

  if (value.isZero()) {
    return '0';
  }

  const [_, decimals] = _value.toString().split('.') || [];

  const parseNumberDecimals = new BigNumber([0, decimals].join('.'));

  const kweiValue = parseNumberDecimals.multipliedBy(10 ** unitsEther.kwei);
  const mweiValue = parseNumberDecimals.multipliedBy(10 ** unitsEther.mwei);
  const gweiValue = parseNumberDecimals.multipliedBy(10 ** unitsEther.gwei);
  const szaboValue = parseNumberDecimals.multipliedBy(10 ** unitsEther.szabo);
  const finneyValue = parseNumberDecimals.multipliedBy(10 ** unitsEther.finney);

  if (kweiValue.gt(1)) {
    return delineate(value.toString(10), unitsEther.kwei + 1, wrapZeroType);
  }

  if (mweiValue.gt(1)) {
    return delineate(value.toString(10), unitsEther.mwei + 1, wrapZeroType);
  }

  if (gweiValue.gt(1)) {
    return delineate(value.toString(10), unitsEther.gwei + 1, wrapZeroType);
  }

  if (szaboValue.gt(1)) {
    return delineate(value.toString(10), unitsEther.szabo + 1, wrapZeroType);
  }
  if (finneyValue.gt(1)) {
    return delineate(value.toString(10), unitsEther.finney + 1, wrapZeroType);
  }

  return delineate(value.toString(10), unitsEther.ether, wrapZeroType);
};
