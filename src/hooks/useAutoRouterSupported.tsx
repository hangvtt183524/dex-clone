import { isSupportedChainId } from 'state/routing/hooks/clientSideSmartOrderRouter';
import { useMemo } from 'react';
import { useSelectedChainNetwork } from 'state/user/hooks';

export default function useAutoRouterSupported(): boolean {
  const chainId = useSelectedChainNetwork();
  return useMemo(() => isSupportedChainId(chainId), [chainId]);
}
