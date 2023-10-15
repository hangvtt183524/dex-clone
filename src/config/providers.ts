import { deepCopy } from '@ethersproject/properties';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { isPlain } from '@reduxjs/toolkit';
import { SupportedChainId } from 'config/sdk-core';
import { RPC_URLS } from './networks';

class AppJsonRpcProvider extends StaticJsonRpcProvider {
  private _blockCache = new Map<string, Promise<any>>();

  get blockCache() {
    // If the blockCache has not yet been initialized this block, do so by
    // setting a listener to clear it on the next block.
    if (!this._blockCache.size) {
      this.once('block', () => this._blockCache.clear());
    }
    return this._blockCache;
  }

  constructor(urls: string[]) {
    super(urls?.[0] || '');
  }

  send(method: string, params: Array<any>): Promise<any> {
    // Only cache eth_call's.
    if (method !== 'eth_call') return super.send(method, params);

    // Only cache if params are serializable.
    if (!isPlain(params)) return super.send(method, params);

    const key = `call:${JSON.stringify(params)}`;
    const cached = this.blockCache.get(key);
    if (cached) {
      this.emit('debug', {
        action: 'request',
        request: deepCopy({ method, params, id: 'cache' }),
        provider: this,
      });
      return cached;
    }

    const result = super.send(method, params);
    this.blockCache.set(key, result);
    return result;
  }
}

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */

// ADD NETWORK
export const RPC_PROVIDERS: {
  [key in SupportedChainId]: StaticJsonRpcProvider;
} = {
  [SupportedChainId.MAINNET]: new AppJsonRpcProvider(RPC_URLS[SupportedChainId.MAINNET]),
  [SupportedChainId.SEPOLIA]: new AppJsonRpcProvider(RPC_URLS[SupportedChainId.SEPOLIA]),
  [SupportedChainId.BSC]: new AppJsonRpcProvider(RPC_URLS[SupportedChainId.BSC]),
  [SupportedChainId.BSC_TESTNET]: new AppJsonRpcProvider(RPC_URLS[SupportedChainId.BSC_TESTNET]),
  [SupportedChainId.POLYGON]: new AppJsonRpcProvider(RPC_URLS[SupportedChainId.POLYGON]),
  [SupportedChainId.POLYGON_MUMBAI]: new AppJsonRpcProvider(RPC_URLS[SupportedChainId.POLYGON_MUMBAI]),
};
