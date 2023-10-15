/**
 * List of all the networks supported by the Uniswap Interface
 */

import { CHAIN_ID } from 'config/env';
import { SupportedChainId } from 'config/sdk-core';

export enum NetworkType {
  L1,
  L2,
}

// ADD NETWORK
export const chainTestnet = [
  SupportedChainId.SEPOLIA,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.BSC_TESTNET,
];

// ADD NETWORK
export const TESTNET_CHAIN_IDS = [
  SupportedChainId.SEPOLIA,
  SupportedChainId.BSC_TESTNET,
  SupportedChainId.POLYGON_MUMBAI,
] as const;

// ADD NETWORK
export const MAINNET_CHAIN_IDS = [SupportedChainId.MAINNET, SupportedChainId.BSC, SupportedChainId.POLYGON] as const;

// ADD NETWORK
export const chainActive = [...MAINNET_CHAIN_IDS, ...(CHAIN_ID === SupportedChainId.SEPOLIA ? chainTestnet : [])];

// ADD NETWORK
export const ChainIdSupportedChart = [SupportedChainId.MAINNET, SupportedChainId.POLYGON];

// ADD NETWORK
export const ETH_CHAIN = [SupportedChainId.MAINNET, SupportedChainId.SEPOLIA];

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!chainActive.includes(chainId);
}

export const chainIdSupportedFarms = (chainId: number | null | undefined): SupportedChainId => {
  const chains = [SupportedChainId.MAINNET, SupportedChainId.SEPOLIA];
  return chains.includes(chainId) ? chainId : CHAIN_ID;
};

// export const getChainId = memoize((chainName: string) => {
//   if (!chainName) return undefined;
//   return CHAIN_QUERY_NAME_TO_ID[chainName] ? +CHAIN_QUERY_NAME_TO_ID[chainName] : undefined;
// });

// ADD NETWORK
export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.SEPOLIA,

  SupportedChainId.BSC,
  SupportedChainId.BSC_TESTNET,

  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
];

/**
 * Unsupported networks for V2 pool behavior.
 */

export const UNSUPPORTED_V2POOL_CHAIN_IDS = [
  // SupportedChainId.POLYGON,
  // SupportedChainId.POLYGON_MUMBAI,
  // SupportedChainId.OPTIMISM,
  // SupportedChainId.ARBITRUM_ONE,
];

// ADD NETWORK
export const NETWORK_SUPPORT_ONLY_V2 = [
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.BSC,
  SupportedChainId.BSC_TESTNET,
] as const;

/**
 * All the chain IDs that are running the Ethereum protocol.
 */

// ADD NETWORK
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.SEPOLIA,

  SupportedChainId.BSC,
  SupportedChainId.BSC_TESTNET,
] as const;

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */

// ADD NETWORK
export const L2_CHAIN_IDS = [
  0 as any,
  // SupportedChainId.ARBITRUM_ONE,
  // SupportedChainId.ARBITRUM_RINKEBY,
  // SupportedChainId.OPTIMISM,
] as const;

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number];

// ADD NETWORK
const DEFAULT_NETWORKS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.SEPOLIA,
];

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: SupportedChainId[] = [],
): { [chainId: number]: T } {
  return DEFAULT_NETWORKS.concat(additionalNetworks).reduce<{
    [chainId: number]: T;
  }>((memo, chainId) => {
    memo[chainId] = address;
    return memo;
  }, {});
}
