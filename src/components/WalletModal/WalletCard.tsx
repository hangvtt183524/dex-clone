import { isMobile } from 'react-device-detect'
import { ButtonProps } from 'components/Button/types';
import { getExternalLinkProps } from 'components/Link/Link';
import Text from 'components/Text';
import React, {useState} from 'react';
import styled, { css } from 'styled-components';
import { MoreHorizontalIcon } from 'svgs';
import { walletLocalStorageKey } from 'packages/wagmi/src/wallet';
import { ConnectorNames } from 'packages/wagmi/src/types';
import Button from '../Button/Button';
import { Login, WalletConfig } from './types';

interface Props<T> {
  walletConfig: WalletConfig<T>;
  login: Login<T>;
  onDismiss: () => void;
  disabled?: boolean;
}

const WalletButton = styled(Button).attrs({
  width: '100%',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 85px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-sizing: border-box;
  border: 0 !important;
  transition: ${({ theme }) => theme.transitions.fast};

  ${({ disabled }) =>
    disabled &&
    css`
      svg {
        opacity: 0.5;
      }
    `}
`;

type MoreWalletCardProps = ButtonProps;

export const MoreWalletCard: React.FC<React.PropsWithChildren<MoreWalletCardProps>> = ({ ...props }) => (
  <WalletButton variant="tertiary" {...props}>
    <MoreHorizontalIcon width="40px" mb="8px" color="textSubtle" />
    <Text fontSize="14px">More</Text>
  </WalletButton>
);

const WalletCard: React.FC<React.PropsWithChildren<Props<any>>> = ({ login, walletConfig, onDismiss, disabled }) => {
  const { title } = walletConfig;

  const Icon = walletConfig.icon as any;

  const handleConnectMobile = async () => {
    if (walletConfig.installed !== false) {
      login(walletConfig.connectorId);
    }

    if (walletConfig.href && walletConfig.installed === false) {
      window.open(walletConfig.href)
    }
  };

  const handleConnectDesktop = async () => {
    login(walletConfig.connectorId);

    if (walletConfig.installed || walletConfig.connectorId === ConnectorNames.WalletConnect) {
      localStorage?.setItem(walletLocalStorageKey, walletConfig.title);
      onDismiss();
    } else {
      window.open(walletConfig.downloadLink?.desktop.toString(), '_blank');
    }
  };

  return isMobile ? (
    <WalletButton
      id={`wallet-connect-${title.toLowerCase()}`}
      onClick={handleConnectMobile}
      {...getExternalLinkProps}
      disabled={disabled}
    >
      <Icon width="32px" height="32px" />
      <Text color={disabled ? 'textSubtle' : 'text'} fontWeight={400} mt="6px" fontSize="12px">
        {title}
      </Text>
    </WalletButton>
  ) : (
      <WalletButton
          id={`wallet-connect-${title.toLowerCase()}`}
          onClick={handleConnectDesktop}
          {...getExternalLinkProps}
          disabled={disabled}
      >
        <Icon width="32px" height="32px" />
        <Text color={disabled ? 'textSubtle' : 'text'} fontWeight={400} mt="6px" fontSize="12px">
          {title}
        </Text>
      </WalletButton>
  );
};

export default WalletCard;
