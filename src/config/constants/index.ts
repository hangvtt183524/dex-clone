import ms from 'ms.macro';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 0;
export const MAXIMUN_ALLOW_SLIPPAGE = 5000; // 50%

// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const DECIMALS_GAS = 18;
export const DECIMALS_CHAIN = 18; // gwei
export const DEFAULT_TOKEN_DECIMAL = 18;
export const DEFAULT_GAS_LIMIT = 250000;

export const GAS_PRICE_INTERVAL = 20000;

export const GAS_GWEI_DECIMALS = 9;

export enum GAS_PRICE {
  default = 5,
  average = 6,
  fast = 7,
  testnet = 10,
}

export const GAS_PRICE_GWEI = {
  default: GAS_PRICE.default,
  average: GAS_PRICE.average,
  fast: GAS_PRICE.fast,
  testnet: GAS_PRICE.testnet,
} as const;

export const AVERAGE_L1_BLOCK_TIME = ms`12s`;
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export const NATIVE_CHAIN_ID = 'NATIVE';

export const DEFAULT_ERC20_DECIMALS = 18;
