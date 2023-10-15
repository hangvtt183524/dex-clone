import { ConnectorNames } from 'packages/wagmi/src/types';
import { useCallback } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { removeCookie } from 'utils/cookies';

const useAuth = () => {
  const {
    connectAsync,
    connectors
  } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const logout = useCallback(async () => {
    try {
      localStorage.clear();
      await disconnectAsync();
      removeCookie('idToken');
    } catch (e) {
      console.error('logout', e);
    }
  }, [disconnectAsync]);

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const connector = connectors.find((connector) => connector.id === connectorID);
      try {
        const connected = await connectAsync({
          connector
        });
        return connected;
      } catch (e) {
        console.error(e);
      }
    },
    [connectors, connectAsync]
  );

  return {
    login,
    logout
  };
};

export default useAuth;
