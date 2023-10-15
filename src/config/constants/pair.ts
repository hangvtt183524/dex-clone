import { SupportedChainId, Token } from 'config/sdk-core';
import { USDC, USDT, WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import { ChainTokenList } from 'config/types/lists';

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean),
);

// ADD NETWORK
// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [SupportedChainId.MAINNET]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.MAINNET],
    USDT[SupportedChainId.MAINNET],
    USDC[SupportedChainId.MAINNET],
  ],

  [SupportedChainId.SEPOLIA]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.SEPOLIA],
    USDT[SupportedChainId.SEPOLIA],
    USDC[SupportedChainId.SEPOLIA],
  ],

  [SupportedChainId.BSC]: [...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.BSC], USDT[SupportedChainId.BSC]],
  [SupportedChainId.BSC_TESTNET]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.BSC_TESTNET],
    USDT[SupportedChainId.BSC_TESTNET],
    USDC[SupportedChainId.BSC_TESTNET],
  ],

  [SupportedChainId.POLYGON]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.POLYGON],
    USDT[SupportedChainId.POLYGON],
    USDC[SupportedChainId.POLYGON],
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[SupportedChainId.POLYGON_MUMBAI],
    USDT[SupportedChainId.POLYGON_MUMBAI],
    USDC[SupportedChainId.POLYGON_MUMBAI],
  ],
};

export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [SupportedChainId.MAINNET]: [[USDC[SupportedChainId.MAINNET], USDT[SupportedChainId.MAINNET]]],
  [SupportedChainId.POLYGON]: [[USDC[SupportedChainId.POLYGON], USDT[SupportedChainId.POLYGON]]],
  [SupportedChainId.POLYGON_MUMBAI]: [[USDC[SupportedChainId.POLYGON_MUMBAI], USDT[SupportedChainId.POLYGON_MUMBAI]]],
  [SupportedChainId.BSC]: [[USDC[SupportedChainId.BSC], USDT[SupportedChainId.BSC]]],
  [SupportedChainId.BSC_TESTNET]: [[USDC[SupportedChainId.BSC_TESTNET], USDT[SupportedChainId.BSC_TESTNET]]],
};
