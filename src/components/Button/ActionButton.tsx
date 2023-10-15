import ConnectButton from 'components/ConnectButton';
import CircleLoader from 'components/Loader/CircleLoaderMini';
import Text from 'components/Text';
import { SupportedChainId } from 'config/sdk-core';

import { networks } from 'config/networks';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { TransactionResponse } from '@ethersproject/providers';
import { useAccount } from 'packages/wagmi/src';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useSwitchNetwork } from 'wagmi';
import { Dots } from 'styles/common';
import Button from './Button';
import { ButtonProps } from './types';

export interface ActionButtonProps extends ButtonProps {
  onSubmit: () => Promise<any>;
  onSucceed?: (data: any) => void; // TODO
  onFailed?: (error: any) => void; // TODO
  children: React.ReactNode;
  disabled?: boolean;
  chainId?: SupportedChainId;
}

enum ActionButtonEnum {
  NORMAL = 'NORMAL',
  CONFIRMING = 'CONFIRMING',
  PENDING = 'PENDING',
  SUBMITED = 'SUBMITED',
  FAILED = 'FAILED',
}
const ActionButton: React.FC<Omit<ActionButtonProps, 'ref'>> = ({
  onSubmit,
  onSucceed,
  onFailed,
  children,
  disabled,
  ...props
}) => {
  const { isConnected } = useAccount();
  const { isWrongNetwork, chainId } = useActiveWeb3React();
  const { switchNetwork, isLoading } = useSwitchNetwork();

  const networkName = networks[chainId]?.networkInfo?.shortName || 'Ethereum';

  const [statusSubmit, setStatusSubmit] = useState<ActionButtonEnum>(ActionButtonEnum.NORMAL);

  const handleSwitchChain = () => {
    switchNetwork(chainId);
  };

  const handleSubmit = useCallback(async () => {
    if (typeof onSubmit === 'function') {
      setStatusSubmit(ActionButtonEnum.CONFIRMING);
      return onSubmit()
        ?.then(async (data: TransactionResponse) => {
          setStatusSubmit(ActionButtonEnum.PENDING);

          const hash = data?.hash || null;
          if (hash) {
            setStatusSubmit(ActionButtonEnum.SUBMITED);

            if (onSucceed) onSucceed(data as any);
          } else {
            setStatusSubmit(ActionButtonEnum.FAILED);
            if (onFailed) onFailed(data as any);
          }
        })
        .catch((err) => {
          setStatusSubmit(ActionButtonEnum.FAILED);
          if (onFailed) onFailed(err);
        });
    }

    if (onFailed) onFailed(null);
  }, [onFailed, onSubmit, onSucceed]);

  const isConfirming = statusSubmit === ActionButtonEnum.CONFIRMING;
  const isPending = statusSubmit === ActionButtonEnum.PENDING;

  const isDisabled = disabled || isConfirming || isPending;

  return isConnected ? (
    isWrongNetwork ? (
      <Button {...props} variant="primary" onClick={handleSwitchChain} disabled={isLoading}>
        {isLoading ? <Dots>Please Switch to {networkName}</Dots> : `Please Switch to ${networkName}`}
      </Button>
    ) : (
      <Button {...props} variant={isDisabled ? 'disabled' : 'primary'} onClick={handleSubmit} disabled={isDisabled}>
        {isConfirming ? (
          <>
            <StyledTitleButton>Confirming on wallet</StyledTitleButton>
            <CircleLoader size="20px" stroke={RoboTheme.colors.textSubtle} />
          </>
        ) : isPending ? (
          <>
            <StyledTitleButton>Submiting</StyledTitleButton>
            <CircleLoader size="20px" stroke={RoboTheme.colors.textSubtle} />
          </>
        ) : (
          <>{children}</>
        )}
      </Button>
    )
  ) : (
    <ConnectButton width="100%" {...props} />
  );
};

const StyledTitleButton = styled(Text).attrs({
  fontSize: '!16px',
  fontWeight: 600,
  mr: '8px',
  color: 'textSubtle',
})``;

export default ActionButton;
