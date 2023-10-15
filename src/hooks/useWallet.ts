import useWalletModal from 'components/WalletModal/useWalletModal';
import { useAccount } from 'packages/wagmi/src';
import { walletLocalStorageKey, wallets } from 'packages/wagmi/src/wallet';
import { useMemo } from 'react';
import useAuth from './useAuth';

export const useWallet = () => {
  const { login } = useAuth();

  const finalWallets = useMemo(
    () =>
      wallets.map((config) => {
        if (!config.installed) {
          return {
            ...config,
            priority: 999,
          };
        }
        return config;
      }),
    [],
  );

  const { onPresentWalletModal } = useWalletModal(login, finalWallets);

  return { onPresentWalletModal };
};

export const useFindWallet = () => {
  const { isConnected } = useAccount();

  return useMemo(() => {
    if (isConnected) {
      const nameWallet = localStorage.getItem(walletLocalStorageKey);
      const findWallet =
        nameWallet && wallets.find((itemWallet) => itemWallet.title.toUpperCase() === nameWallet.toUpperCase());
      return findWallet;
    }
    return null;
  }, [isConnected]);
};
