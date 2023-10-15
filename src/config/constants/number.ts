import BigNumber from 'bignumber.js';
import JSBI from 'jsbi';

export const BIG_ZERO = new BigNumber(0);
export const BIG_ONE = new BigNumber(1);
export const BIG_TWO = new BigNumber(2);
export const BIG_NINE = new BigNumber(9);
export const BIG_TEN = new BigNumber(10);
export const BIG_MAX = new BigNumber(2 ** 256);

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000);
export const JSBI_NEGATIVE_ONE = JSBI.BigInt(-1);
export const JSBI_ZERO = JSBI.BigInt(0);
export const JSBI_ONE = JSBI.BigInt(1);
export const JSBI_TWO = JSBI.BigInt(2);
export const JSBI_THREE = JSBI.BigInt(3);
export const JSBI_FIVE = JSBI.BigInt(5);
export const JSBI_TEN = JSBI.BigInt(10);
export const JSBI_997 = JSBI.BigInt(997);
export const JSBI_1000 = JSBI.BigInt(1000);
export const JSBI_MAX = JSBI.BigInt(2 ** 256);
export const BIPS_BASE = JSBI.BigInt(10000);
export const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
export const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2));

// exports for external consumption
export type BigintIsh = JSBI | string | number;

export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

export enum Rounding {
  ROUND_DOWN = 0,
  ROUND_HALF_UP = 1,
  ROUND_UP = 3,
}

export type UnitEther = 'wei' | 'kwei' | 'mwei' | 'gwei' | 'szabo' | 'finney' | 'ether';
export const unitsEther: { [key in UnitEther]: number } = {
  wei: 0,
  kwei: 3,
  mwei: 6,
  gwei: 9,
  szabo: 12,
  finney: 15,
  ether: 18,
};

export const KWEI_NUMBER = 1 * 10 ** unitsEther.kwei;
export const MWEI_NUMBER = 1 * 10 ** unitsEther.mwei;
export const GWEI_NUMBER = 1 * 10 ** unitsEther.gwei;
export const SZABO_NUMBER = 1 * 10 ** unitsEther.szabo;
export const FINNEY_NUMBER = 1 * 10 ** unitsEther.finney;
export const ETHER_NUMBER = 1 * 10 ** unitsEther.ether;
