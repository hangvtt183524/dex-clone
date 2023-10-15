import { SupportedChainId, Token } from 'config/sdk-core';
import { SerializedToken } from './token';

export interface TokenList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: {
    major: number | string;
    minor: number | string;
    patch: number | string;
  };
  readonly tokens: SerializedToken[];
  readonly keywords?: string[];
  readonly tags?: any;
  readonly logoURI?: string;
}
/**
 * An empty result, useful as a default.
 */

export type TokenAddressMap = Readonly<{
  [chainId in SupportedChainId]?: Readonly<{
    [tokenAddress: string]: { token: Token; list: TokenList };
  }>;
}>;

// ADD NETWORK
export const EMPTY_LIST: TokenAddressMap = {
  [SupportedChainId.MAINNET]: {},
  [SupportedChainId.SEPOLIA]: {},
  [SupportedChainId.BSC]: {},
  [SupportedChainId.BSC_TESTNET]: {},
};

export type ChainMap<T> = {
  readonly [chainId in number]: T;
};

export type ChainTokenList = ChainMap<Token[]>;
