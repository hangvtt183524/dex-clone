import { GetNetworkResult } from '@wagmi/core';
import { useMemo } from 'react';
import { useNetwork as useNetworkWagmi } from 'wagmi';

export const useNetwork = (): GetNetworkResult => {
  const network = useNetworkWagmi();
  return useMemo(() => network, [network]);
};
