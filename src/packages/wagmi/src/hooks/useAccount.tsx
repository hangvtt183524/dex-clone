import { GetAccountResult, Provider } from '@wagmi/core';
import { useMemo } from 'react';
import { useAccount as useAccountWagami } from 'wagmi';

export const useAccount = (): GetAccountResult<Provider> => {
  const account = useAccountWagami();
  return useMemo(() => account, [account]);
};
