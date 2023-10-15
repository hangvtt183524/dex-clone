import { BigNumber } from '@ethersproject/bignumber';
import { useSingleCallResult } from 'state/multicall/hooks';
import { useMemo } from 'react';
import { useMulticallContract } from './useContract';

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticallContract();
  const resultStr: string | undefined = useSingleCallResult(
    multicall,
    'getCurrentBlockTimestamp',
  )?.result?.[0]?.toString();
  return useMemo(() => (typeof resultStr === 'string' ? BigNumber.from(resultStr) : undefined), [resultStr]);
}
