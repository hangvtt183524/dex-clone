import { SupportedChainId } from 'config/sdk-core';
import JSBI from 'jsbi';

// ADD CHAIN
// UPDATE MAINNET
export const INIT_CODE_HASH: {
  [chain in SupportedChainId]?: string;
} = {
  [SupportedChainId.SEPOLIA]: '0x5dc1a9c88c7c36d26f87be9124a1d550f27100bf11121a85419adbc61436bafc',
  [SupportedChainId.MAINNET]: '0x5dc1a9c88c7c36d26f87be9124a1d550f27100bf11121a85419adbc61436bafc',
  [SupportedChainId.POLYGON]: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
};

export const INIT_CODE_HASH_UNISWAP: {
  [chain in SupportedChainId]?: string;
} = {
  [SupportedChainId.SEPOLIA]: '0x5dc1a9c88c7c36d26f87be9124a1d550f27100bf11121a85419adbc61436bafc',
  [SupportedChainId.MAINNET]: '0x5dc1a9c88c7c36d26f87be9124a1d550f27100bf11121a85419adbc61436bafc',
  [SupportedChainId.POLYGON]: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
};

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000);

// exports for internal consumption
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const FIVE = JSBI.BigInt(5);
export const _997 = JSBI.BigInt(997);
export const _1000 = JSBI.BigInt(1000);
