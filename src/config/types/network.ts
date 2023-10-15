import { NetworkType } from 'config/constants/chains';

export type Network = {
  code: string;
  chainId: number;
  rpcCollections?: string[];
  blockExplorerUrls?: string;
  blockExplorerName?: string;
  networkType: NetworkType;
  roboApiID?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  networkInfo: {
    icon: string;
    displayName: string;
    shortName: string;
  };
  otherInfo: {
    color: string;
    coingeckoNetworkId: string;
    coingeckoNativeTokenId: string;
    aggregatorRoute: string;
  };
};
