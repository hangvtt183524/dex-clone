import { isSupportedChain } from 'config/constants/chains';
import { CHAIN_ID } from 'config/env';
import { networks } from 'config/networks';
import { SupportedChainId } from 'config/sdk-core';

export const getExplorerLink = (
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId: SupportedChainId = CHAIN_ID,
): string => {
  if (!isSupportedChain(chainId)) return;

  const explorer = networks[chainId]?.blockExplorerUrls;

  switch (type) {
    case 'transaction': {
      return `${explorer}/tx/${data}`;
    }
    case 'token': {
      return `${explorer}/token/${data}`;
    }
    case 'block': {
      return `${explorer}/block/${data}`;
    }
    case 'countdown': {
      return `${explorer}/block/countdown/${data}`;
    }
    default: {
      return `${explorer}/address/${data}`;
    }
  }
};

export function getExploreName(chainIdOverride?: number) {
  const chainId = chainIdOverride || SupportedChainId.MAINNET;
  const chain = Object.values(networks).find((c) => c.chainId === chainId);
  return chain?.blockExplorerName || networks[SupportedChainId.MAINNET].blockExplorerName;
}
