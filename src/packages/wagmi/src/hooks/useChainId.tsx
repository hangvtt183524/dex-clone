import { useMemo } from 'react';
import { useChainId as useChainIdWagami } from 'wagmi';

export const useChainId = (data?: { chainId?: number }): number => {
  const chainIds = useChainIdWagami(data);
  return useMemo(() => chainIds, [chainIds]);
};
