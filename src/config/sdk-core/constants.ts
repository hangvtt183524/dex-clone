import JSBI from 'jsbi';

export enum SupportedChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,

  POLYGON = 137,
  POLYGON_MUMBAI = 80001,

  BSC = 56,
  BSC_TESTNET = 97,
}

export const SupportedNetwork = {
    1: 'ethereum',
    11155111: 'sepolia',
}

// exports for external consumption
export type BigintIsh = JSBI | string | number;

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
