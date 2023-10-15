import { Client, Provider, WebSocketProvider } from '@wagmi/core';
import { useMemo } from 'react';
import { useClient as useClientWagmi } from 'wagmi';

export const useClient = (): Client<Provider, WebSocketProvider> => {
  const client = useClientWagmi<Provider, WebSocketProvider>();
  return useMemo(() => client, [client]);
};
