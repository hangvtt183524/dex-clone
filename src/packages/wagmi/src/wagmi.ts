import memoize from 'lodash/memoize';
import { configureChains, createClient } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { CHAIN_ID, INFURA_KEY } from 'config/env';
import { SupportedChainId } from 'config/sdk-core';
import { invert } from 'lodash';
import { bsc, bscTestnet, mainnet, polygon, polygonMumbai, sepolia } from 'wagmi/chains';
import { TrustWalletConnector } from '../connectors/trustWallet';
import { RoboWalletConnector } from '../connectors/roboInuWallet';

// ADD NETWORK
const CHAINS = [
    {
        ...mainnet,
        rpcUrls: {
            ...mainnet.rpcUrls,
            default: {
                http: ['https://eth.llamarpc.com'],
            },
            public: {
                http: ['https://eth.llamarpc.com'],
            },
        },
    },
    bsc,
    polygon,
    {
        ...sepolia,
        rpcUrls: {
            ...sepolia.rpcUrls,
            infura: {
                http: ['https://endpoints.omniatech.io/v1/eth/sepolia/public'],
            },
            default: {
                http: ['https://endpoints.omniatech.io/v1/eth/sepolia/public'],
            },
            public: {
                http: ['https://endpoints.omniatech.io/v1/eth/sepolia/public'],
            },
        },
    },
    polygonMumbai,
    bscTestnet,
];

export const { provider, chains } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => {
      return { http: chain.rpcUrls.default.http[0] };
    },
  }),
]);

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
});

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'RoboEx',
    appLogoUrl: 'https://pancakeswap.com/logo.png', // TODO
  },
});

export const walletConnectConnector = new WalletConnectLegacyConnector({
  chains,
  options: {
    qrcode: true,
  },
});

export const walletConnectNoQrCodeConnector = new WalletConnectLegacyConnector({
  chains,
  options: {
    qrcode: false,
  },
});

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
});

export const roboInuConnector = new RoboWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
  },
});

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});

export const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    trustWalletConnector,
    roboInuConnector,
  ],
});

export const CHAIN_IDS = chains.map((c) => c.id);

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId as any));
export const defaultChain = CHAIN_ID === sepolia.id ? sepolia : mainnet;

// ADD NETWORK
export const CHAIN_QUERY_NAME = {
  [SupportedChainId.MAINNET]: 'eth',
  [SupportedChainId.SEPOLIA]: 'sepolia',
  [SupportedChainId.BSC]: 'bsc',
  [SupportedChainId.BSC_TESTNET]: 'bscTestnet',
};

const CHAIN_QUERY_NAME_TO_ID = invert(CHAIN_QUERY_NAME);

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined;
  return CHAIN_QUERY_NAME_TO_ID[chainName] ? +CHAIN_QUERY_NAME_TO_ID[chainName] : undefined;
});
