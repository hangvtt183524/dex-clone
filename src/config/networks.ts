import { SupportedChainId } from 'config/sdk-core';
import { NetworkType, SupportedL2ChainId } from './constants/chains';
import { INFURA_KEY } from './env';
import { Network } from './types/network';

export type IChainID = (typeof SupportedChainId)[keyof typeof SupportedChainId];

const path = '/assets/images/chains';

type NetworkByChain = {
  [key: string]: Network;
};

// NetworkPolygonMainnet  = "polygon-pos"
// NetworkEthereumMainnet = "ethereum"
// NetworkBSCMainnet      = "binance-smart-chain"

// ADD NETWORK
export const networks: NetworkByChain = {
  [SupportedChainId.MAINNET]: {
    code: 'ETH',
    chainId: SupportedChainId.MAINNET,
    networkType: NetworkType.L1,
    rpcCollections: ['https://rpc.ankr.com/eth'],
    blockExplorerUrls: 'https://etherscan.io',
    blockExplorerName: 'Etherscan',
    roboApiID: 'ethereum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    networkInfo: {
      displayName: 'Ethereum',
      icon: `${path}/eth.png`,
      shortName: 'Ethereum',
    },
    otherInfo: {
      color: '#5a5e83',
      coingeckoNetworkId: 'ethereum',
      coingeckoNativeTokenId: 'ethereum',
      aggregatorRoute: 'ethereum',
    },
  },

  [SupportedChainId.SEPOLIA]: {
    code: 'SEPOLIA',
    chainId: SupportedChainId.SEPOLIA,
    networkType: NetworkType.L1,

    rpcCollections: ['https://endpoints.omniatech.io/v1/eth/sepolia/public'],
    blockExplorerUrls: 'https://sepolia.etherscan.io',
    blockExplorerName: 'Sepolia Etherscan',
    roboApiID: 'ethereum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    networkInfo: {
      displayName: 'Ethereum Sepolia',
      icon: `${path}/eth.png`,
      shortName: 'ETH Sepolia',
    },
    otherInfo: {
      color: '#cb4241',
      coingeckoNetworkId: 'ethereum',
      coingeckoNativeTokenId: 'ethereum',
      aggregatorRoute: 'ethereum',
    },
  },

  [SupportedChainId.POLYGON_MUMBAI]: {
    code: 'MUMBAI',
    chainId: SupportedChainId.POLYGON_MUMBAI,
    networkType: NetworkType.L1,

    rpcCollections: ['https://matic-mumbai.chainstacklabs.com'],
    blockExplorerUrls: 'https://mumbai.polygonscan.com',
    blockExplorerName: 'Mumbai Polygon Etherscan',
    roboApiID: 'polygon-pos',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    networkInfo: {
      displayName: 'Mumbai',
      icon: `${path}/eth.png`,
      shortName: 'Mumbai',
    },
    otherInfo: {
      color: '#cb4241',
      coingeckoNetworkId: 'polygon-pos',
      coingeckoNativeTokenId: 'matic-network',
      aggregatorRoute: 'polygon',
    },
  },

  [SupportedChainId.POLYGON]: {
    code: 'POLYGON',
    chainId: SupportedChainId.POLYGON,
    networkType: NetworkType.L1,
    roboApiID: 'polygon-pos',

    rpcCollections: ['https://polygon-rpc.com'],
    blockExplorerUrls: 'https://polygonscan.com',
    blockExplorerName: 'Polygon Etherscan',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    networkInfo: {
      displayName: 'Polygon',
      icon: `${path}/eth.png`,
      shortName: 'Polygon',
    },
    otherInfo: {
      color: '#cb4241',

      coingeckoNetworkId: 'polygon-pos',
      coingeckoNativeTokenId: 'matic-network',
      aggregatorRoute: 'mumbai',
    },
  },

  [SupportedChainId.BSC]: {
    code: 'BSC',
    chainId: 56,
    networkType: NetworkType.L1,
    rpcCollections: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninitoken.io/',
    ],
    roboApiID: 'binance-smart-chain',

    blockExplorerUrls: 'https://bscscan.com',
    blockExplorerName: 'Bscscan',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    networkInfo: {
      displayName: 'Binance Smart Chain',
      icon: `${path}/bsc.png`,
      shortName: 'BSC',
    },
    otherInfo: {
      color: '#e8be42',
      coingeckoNetworkId: 'binance-smart-chain',
      coingeckoNativeTokenId: 'binancecoin',
      aggregatorRoute: 'bsc',
    },
  },
  [SupportedChainId.BSC_TESTNET]: {
    code: 'BSC',
    chainId: 97,
    networkType: NetworkType.L1,
    rpcCollections: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: 'https://testnet.bscscan.com',
    blockExplorerName: 'Bscscan',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    roboApiID: 'binance-smart-chain',
    networkInfo: {
      displayName: 'BSC Testnet',
      icon: `${path}/bsc.png`,
      shortName: 'BSC',
    },
    otherInfo: {
      color: '#e8be42',
      coingeckoNetworkId: 'binance-smart-chain',
      coingeckoNativeTokenId: 'binancecoin',
      aggregatorRoute: 'bsc',
    },
  },
};

// ADD NETWORK
export const FALLBACK_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [
    // "Safe" URLs
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],

  [SupportedChainId.SEPOLIA]: [
    // "Safe" URLs
    'https://rpc2.sepolia.org',
    // "Fallback" URLs
    'https://endpoints.omniatech.io/v1/eth/sepolia/public',
  ],

  [SupportedChainId.POLYGON]: [
    // "Safe" URLs
    'https://polygon-rpc.com/',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet-full-rpc.bwarelabs.com',
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    // "Safe" URLs
    'https://matic-mumbai.chainstacklabs.com',
    'https://rpc-mumbai.maticvigil.com',
    'https://matic-testnet-archive-rpc.bwarelabs.com',
  ],
  [SupportedChainId.BSC]: [
    // "Safe" URLs
    'https://bsc-dataseed1.binance.org',
    // "Fallback" URLs
    '',
  ],
  [SupportedChainId.BSC_TESTNET]: [
    // "Safe" URLs
    '',
    // "Fallback" URLs
    'https://rpc.ankr.com/bsc_testnet_chapel',
  ],
};

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */

// ADD NETWORK
export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: [
    `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.SEPOLIA]: [
    `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.SEPOLIA],
  ],

  [SupportedChainId.POLYGON]: [
    `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.POLYGON],
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
    ...FALLBACK_URLS[SupportedChainId.POLYGON_MUMBAI],
  ],
  [SupportedChainId.BSC]: ['https://bsc-dataseed.binance.org', ...FALLBACK_URLS[SupportedChainId.BSC]],
  [SupportedChainId.BSC_TESTNET]: [
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    ...FALLBACK_URLS[SupportedChainId.BSC_TESTNET],
  ],
};
export function isL2ChainId(chainId: number | undefined): chainId is SupportedL2ChainId {
  const chainInfo = networks[chainId];
  return chainInfo?.networkType === NetworkType.L2;
}
