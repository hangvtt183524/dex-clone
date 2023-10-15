import { SupportedChainId, Token } from 'config/sdk-core';

export type TokenSymbolByChain = {
  [key in SupportedChainId]: {
    [symbol: string]: Token;
  };
};

export type TokenByChain = {
  [key in SupportedChainId]: Token;
};
export type ChainTokenList = {
  [key in SupportedChainId]: Token[];
};
export interface SerializedToken {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  chainId: number;
  wrapped?: {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    chainId: number;
  };
}
