import useModal from 'hooks/useModal';
import WalletModal from 'components/WalletModal/WalletModal';
import { Login, WalletConfig } from 'components/WalletModal/types';
import React from 'react';

interface ReturnType {
  onPresentWalletModal: () => void;
}

function useWalletModal<T>(login: Login<T>, wallets: WalletConfig<T>[]): ReturnType {
  const [onPresentWalletModal] = useModal(<WalletModal login={login} wallets={wallets} />, {
    modalId: 'wallet-modal',
  });
  return { onPresentWalletModal };
}

export default useWalletModal;
