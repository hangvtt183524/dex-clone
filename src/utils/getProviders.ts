import { JsonRpcSigner, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { CHAIN_ID } from 'config/env';
import { SupportedChainId } from 'config/sdk-core';
import { getBlockchainRpcs, getRpcUrl } from 'utils/getRpcUrl';
import { RPC_URLS } from 'config/networks';
import { Provider } from '@wagmi/core';

const RPC_URL = getRpcUrl();
const RPC_URL_CHAIN_IDS = getBlockchainRpcs();

export const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL);

// ADD PROVIDER
export const getProvider = ({ chainId = CHAIN_ID }: { chainId?: number }) => {
  switch (chainId) {
    case SupportedChainId.BSC:
      return bscProvider;
    case SupportedChainId.BSC_TESTNET:
      return bscTestnetProvider;

    case SupportedChainId.POLYGON:
      return polygonProvider;
    case SupportedChainId.POLYGON_MUMBAI:
      return mumbaiProvider;

    case SupportedChainId.MAINNET:
      return mainnetProvider;
    default:
      return null;
  }
};

export const bscProvider = new StaticJsonRpcProvider(
  {
    url: RPC_URLS[SupportedChainId.BSC][0],
    skipFetchSetup: true,
  },
  SupportedChainId.BSC,
);

export const bscTestnetProvider = new StaticJsonRpcProvider(
  {
    url: RPC_URLS[SupportedChainId.BSC_TESTNET][0],
    skipFetchSetup: true,
  },
  SupportedChainId.BSC_TESTNET,
);
export const mainnetProvider = new StaticJsonRpcProvider(
  {
    url: RPC_URLS[SupportedChainId.MAINNET][0],
    skipFetchSetup: true,
  },
  SupportedChainId.MAINNET,
);

export const polygonProvider = new StaticJsonRpcProvider(
  {
    url: RPC_URLS[SupportedChainId.POLYGON][0],
    skipFetchSetup: true,
  },
  SupportedChainId.POLYGON,
);

export const mumbaiProvider = new StaticJsonRpcProvider(
  {
    url: RPC_URLS[SupportedChainId.POLYGON_MUMBAI][0],
    skipFetchSetup: true,
  },
  SupportedChainId.POLYGON_MUMBAI,
);

export class SimpleRpcProvider {
  private static _simpleRpcProviderMap = {
    [CHAIN_ID]: simpleRpcProvider,
  };

  public static get(chainId: SupportedChainId = CHAIN_ID) {
    if (!this._simpleRpcProviderMap[chainId]) {
      this._simpleRpcProviderMap[chainId] = new StaticJsonRpcProvider(
        RPC_URL_CHAIN_IDS[chainId] || RPC_URL_CHAIN_IDS[CHAIN_ID],
      );
    }

    return this._simpleRpcProviderMap[chainId];
  }
}

export function getSigner(library: Provider, account: string): JsonRpcSigner {
  return (library as Web3Provider)?.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(library: Provider, account?: string): Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}
