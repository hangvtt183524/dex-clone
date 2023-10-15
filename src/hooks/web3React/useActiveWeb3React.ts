import { useAccount } from 'packages/wagmi/src';
import { useChainId, useNetwork, useProvider } from 'wagmi';

const useActiveWeb3React = () => {
  const chainId = useChainId();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider({ chainId });

  return { isWrongNetwork: chain && chainId !== chain.id, chainId, provider, account: address };
};

export default useActiveWeb3React;
