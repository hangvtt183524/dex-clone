import { CHAIN_ID } from 'config/env';
import { networks } from 'config/networks';
import { SupportedChainId } from 'config/sdk-core';

export const getRpcUrl = (chainId: SupportedChainId = CHAIN_ID) => networks[chainId].rpcCollections[0];

export const getBlockchainRpcs = (): {
  [chainId in SupportedChainId]?: string;
} =>
  Object.values(SupportedChainId).reduce((memo, chainId) => {
    memo[chainId] = networks[chainId]?.rpcCollections[0];
    return memo;
  }, {});
