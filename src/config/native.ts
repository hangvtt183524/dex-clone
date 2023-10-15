/* eslint-disable no-useless-constructor */
import invariant from 'tiny-invariant';
import { NativeCurrency, SupportedChainId, Token } from 'config/sdk-core';
import { NATIVE_TOKEN, WRAPPED_NATIVE_CURRENCY } from './tokens';

/**
 *
 * Native is the main usage of a 'native' currency, i.e. for BSC mainnet and all testnets
 */
export class Native extends NativeCurrency {
  constructor(chainId: SupportedChainId, decimals: number, symbol: string, name: string) {
    super(chainId, decimals, symbol, name);
  }

  public get wrapped(): Token {
    const wnative = WRAPPED_NATIVE_CURRENCY[this.chainId] || null;
    return wnative;
  }

  private static cache: { [chainId: number]: Native } = {};

  public static onChain(chainId: number): Native {
    if (chainId in this.cache) {
      return this.cache[chainId];
    }

    invariant(!!NATIVE_TOKEN[chainId], 'NATIVE_CURRENCY');
    const native = NATIVE_TOKEN[chainId];

    this.cache[chainId] = new Native(native.chainId, native.decimals, native.symbol, native.name);
    return this.cache[chainId];
  }

  public equals(other: Token): boolean {
    return (
      other?.chainId === this.chainId &&
      this.wrapped.address?.toLowerCase() === (other?.wrapped.address || other?.address)?.toLowerCase()
    );
  }
}
