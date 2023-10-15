import { CHAIN_ID } from 'config/env';
import { SupportedChainId, Token } from 'config/sdk-core';
import { NATIVE_TOKEN, WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import { useMemo } from 'react';
import { Native } from 'config/native';

import { useSelectedChainNetwork } from 'state/user/hooks';

export const isNativeCurrency = (token: Token, chainId: SupportedChainId) => {
  return token.isNative || NATIVE_TOKEN[chainId].symbol === token.symbol;
};

export const isWrapNativeCurrency = (token: Token, chainId: SupportedChainId) => {
  return WRAPPED_NATIVE_CURRENCY[chainId]?.address?.toLowerCase() === token?.wrapped?.address?.toLowerCase();
};

const useNativeCurrency = (): Native => {
  const chainId = useSelectedChainNetwork();

  return useMemo(() => {
    try {
      const nativeCurrency: Token = NATIVE_TOKEN[chainId] ?? NATIVE_TOKEN[CHAIN_ID];
      return new Native(nativeCurrency.chainId, nativeCurrency.decimals, nativeCurrency.symbol, nativeCurrency.name);
    } catch (e) {
      const defaultNativeCurrency = NATIVE_TOKEN[CHAIN_ID];
      return new Native(
        defaultNativeCurrency.chainId,
        defaultNativeCurrency.decimals,
        defaultNativeCurrency.symbol,
        defaultNativeCurrency.name,
      );
    }
  }, [chainId]);
};
export default useNativeCurrency;
