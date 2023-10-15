import { useMemo } from 'react';
import { useAccount, useProvider, useSigner } from 'wagmi';
import {useSelectedChainNetwork} from 'state/user/hooks';

export const useProviderOrSigner = (withSignerIfPossible = true) => {
  const chainId = useSelectedChainNetwork();
  const provider = useProvider({ chainId });
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner({
    chainId,
  });

  return useMemo(
    () => (withSignerIfPossible && address && isConnected && signer ? signer : provider),
    [address, isConnected, provider, signer, withSignerIfPossible],
  );
};
