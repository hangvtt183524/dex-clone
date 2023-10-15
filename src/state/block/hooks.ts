/* eslint-disable camelcase */
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants/time';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import useSWR, { useSWRConfig, unstable_serialize } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { useProvider } from 'wagmi';
import { useSelectedChainNetwork } from '../user/hooks';

const REFRESH_BLOCK_INTERVAL = 4000;

export const usePollBlockNumber = () => {
  const { cache, mutate } = useSWRConfig();
  const { provider } = useActiveWeb3React();
  const chainId = useSelectedChainNetwork();

  const { data } = useSWR(
    chainId && ['blockNumberFetcher', chainId],
    async () => {
      const blockNumber = await provider.getBlockNumber();
      mutate(['blockNumber', chainId], blockNumber);
      if (!cache.get(unstable_serialize(['initialBlockNumber', chainId]))?.data) {
        mutate(['initialBlockNumber', chainId], blockNumber);
      }
      return blockNumber;
    },
    {
      refreshInterval: REFRESH_BLOCK_INTERVAL,
    },
  );

  useSWR(
    chainId && [FAST_INTERVAL, 'blockNumber', chainId],
    async () => {
      return data;
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  );

  useSWR(
    chainId && [SLOW_INTERVAL, 'blockNumber', chainId],
    async () => {
      return data;
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  );
};

export const useCurrentBlock = (): number => {
  const chainId = useSelectedChainNetwork();
  const { data: currentBlock = 0 } = useSWRImmutable(['blockNumber', chainId]);
  return currentBlock;
};

export const useChainCurrentBlock = (chainId: number): number => {
  const { chainId: activeChainId } = useActiveWeb3React();
  const provider = useProvider({ chainId });
  const { data: currentBlock = 0 } = useSWR(
    chainId ? (activeChainId === chainId ? ['blockNumber', chainId] : ['chainBlockNumber', chainId]) : null,
    activeChainId !== chainId
      ? async () => {
          const blockNumber = await provider.getBlockNumber();
          return blockNumber;
        }
      : undefined,
    activeChainId !== chainId
      ? {
          refreshInterval: REFRESH_BLOCK_INTERVAL,
        }
      : undefined,
  );
  return currentBlock;
};

export const useInitialBlock = (): number => {
    const chainId = useSelectedChainNetwork();
  const { data: initialBlock = 0 } = useSWRImmutable(['initialBlockNumber', chainId]);
  return initialBlock;
};
