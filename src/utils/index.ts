import { BigintIsh } from 'config/constants/number';
import JSBI from 'jsbi';
import Numeral from 'numeral';

export function toHex(bigintIsh: BigintIsh) {
  const bigInt = JSBI.BigInt(bigintIsh);
  let hex = bigInt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`;
  }
  return `0x${hex}`;
}

export const toKInChart = (num: string, unit?: string) => {
  if (parseFloat(num) < 0.0000001) return `< ${unit ?? ''}0.0000001`;
  if (parseFloat(num) >= 0.1) return (unit ?? '') + Numeral(num).format('0.[00]a');
  return (unit ?? '') + Numeral(num).format('0.[0000000]a');
};
export const vaildItem = (item) => item;
