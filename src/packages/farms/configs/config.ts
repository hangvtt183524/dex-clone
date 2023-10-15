import { SupportedChainId } from 'config/sdk-core';
import { mainnetFarm } from './chains/ethereum/mainnet';
import { sepoliaFarm } from './chains/ethereum/sepolia';

export const FARMS = {
  [SupportedChainId.MAINNET]: mainnetFarm,
  [SupportedChainId.SEPOLIA]: sepoliaFarm,
};
