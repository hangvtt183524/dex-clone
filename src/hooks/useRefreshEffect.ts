import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants/time';
import { DependencyList, EffectCallback, useEffect } from 'react';
import useSWR from 'swr';

type BlockEffectCallback = (blockNumber: number) => ReturnType<EffectCallback>;

export function useFastRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([FAST_INTERVAL, 'blockNumber']);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || [])]);
}

export function useSlowRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([SLOW_INTERVAL, 'blockNumber']);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || [])]);
}
