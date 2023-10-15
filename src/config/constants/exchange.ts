import { SupportedChainId, Token } from 'config/sdk-core';
import { BUSD, ROBO, USDC, USDT, WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import { ChainTokenList } from 'config/types/lists';

// ADD NETWORK
export const SUGGESTED_BASES: ChainTokenList = {
  [SupportedChainId.MAINNET]: [
    ROBO[SupportedChainId.MAINNET],
    USDC[SupportedChainId.MAINNET],
    USDT[SupportedChainId.MAINNET],
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.MAINNET],
  ] as Token[],

  [SupportedChainId.SEPOLIA]: [
    ROBO[SupportedChainId.SEPOLIA],
    USDC[SupportedChainId.SEPOLIA],
    WRAPPED_NATIVE_CURRENCY[SupportedChainId.SEPOLIA],
    BUSD[SupportedChainId.SEPOLIA],
  ] as Token[],

  [SupportedChainId.POLYGON]: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.POLYGON]],
  [SupportedChainId.POLYGON_MUMBAI]: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.POLYGON_MUMBAI]],

  [SupportedChainId.BSC]: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.BSC]],
  [SupportedChainId.BSC_TESTNET]: [WRAPPED_NATIVE_CURRENCY[SupportedChainId.BSC_TESTNET]],
};
