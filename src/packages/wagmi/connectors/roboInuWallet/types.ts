import { EIP1193Provider } from 'viem';

type InjectedProviderFlags = {
  isRoboInu?: true;
};

type InjectedProviders = InjectedProviderFlags & {
  isMetaMask: true;
  /** Only exists in MetaMask as of 2022/04/03 */
  _events: {
    connect?: () => void;
  };
  /** Only exists in MetaMask as of 2022/04/03 */
  _state?: {
    accounts?: string[];
    initialized?: boolean;
    isConnected?: boolean;
    isPermanentlyDisconnected?: boolean;
    isUnlocked?: boolean;
  };
};

export interface WindowProvider extends InjectedProviders, EIP1193Provider {
  providers?: WindowProvider[];
}
