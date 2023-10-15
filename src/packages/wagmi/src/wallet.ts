import React, { ReactNode } from 'react';
import { RoboIcon, MetamaskIcon, WalletConnectIcon, TrustWalletIcon, CoinbaseWalletIcon } from 'svgs';
import { ConnectorNames } from './types';
import { getTrustWalletProvider } from '../connectors/trustWallet/trustWallet';
import { SERVER_URL } from '../../../config/env';

export const walletLocalStorageKey = 'wallet';
export const ClientConnected = 'wagmi.connected';

const isWindowEnabled = () => {
  if (typeof window !== 'undefined') {
    return true;
  }
};
const isWalletLinkInstalled = () => {
  return isWindowEnabled() && window?.WalletLink && window?.WalletLinkProvider;
};

const isCoinBaseInstalled = () => {
  return (
    isWindowEnabled() &&
    isWalletLinkInstalled() &&
    window?.coinbaseWalletExtension &&
    window?.coinbaseWalletRequestProvider
  );
};

const isRoboInstalled = () => {
  return isWindowEnabled() && !!window.roboinu && !!window.roboinu.providers.ethereum.isRoboInu;
};

const isMetamaskInstalled = () => {
  return isWindowEnabled() && Boolean(window.ethereum?.isMetaMask);
};
export interface WalletConfig<T> {
  title: string;
  icon: React.ReactNode;
  connectorId: T;
  priority: number | (() => number);
  href?: string;
  installed?: boolean;
  downloadLink?: {
    desktop?: string;
    mobile?: string;
  };
}

export const wallets: WalletConfig<ConnectorNames>[] = [
  {
    title: 'Robo Wallet',
    icon: RoboIcon,
    get installed() {
      return isRoboInstalled()
    },
    connectorId: ConnectorNames.RoboInu,
    priority: 1,
    href: 'https://dashboard.roboglobal.info/',
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/robo-wallet-testnet/namdenejojopbnekajecohieicljpcgb/',
      mobile: 'https://play.google.com/store/apps/details?id=com.roboglobal.wallet'
    },
  },
  {
    title: 'Metamask',
    icon: MetamaskIcon,
    get installed() {
      return isMetamaskInstalled()
    },
    connectorId: ConnectorNames.MetaMask,
    priority: 2,
    downloadLink: {
      desktop: 'https://metamask.io/download/',
    },
    href: `https://metamask.app.link/dapp/${SERVER_URL}/`,
  },
  {
    title: 'Coinbase Wallet',
    get installed() {
      return isCoinBaseInstalled()
    },
    icon: CoinbaseWalletIcon as unknown as ReactNode,
    connectorId: ConnectorNames.WalletLink,
    downloadLink: {
      desktop: 'https://www.coinbase.com/wallet/downloads',
    },
    priority: 3,
  },
  {
    title: 'Trust Wallet',
    icon: TrustWalletIcon,
    connectorId: ConnectorNames.TrustWallet,
    get installed() {
      return !!getTrustWalletProvider()
    },
    priority: 4,
    href: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://https://dex-testnet.roboglobal.info/swap/',
    downloadLink: {
      desktop: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/related',
    },
  },
  {
    title: 'WalletConnect',
    icon: WalletConnectIcon,
    connectorId: ConnectorNames.WalletConnect,
    priority: 5,
  },
];
