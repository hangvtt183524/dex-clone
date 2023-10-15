import Text from 'components/Text';
import { useWallet } from 'hooks/useWallet';
import Button from 'components/Button';
import { ButtonProps } from 'components/Button/types';
import React from 'react';

const ConnectButton = ({ ...props }: ButtonProps) => {
  const { onPresentWalletModal } = useWallet();

  const handleClick = () => {
    onPresentWalletModal();
  };

  return (
    <Button onClick={handleClick} {...props}>
      <Text whiteSpace="nowrap" scale="sm" fontWeight={[500, 500, 500, 600]}>
        Connect Wallet
      </Text>
    </Button>
  );
};

export default ConnectButton;
