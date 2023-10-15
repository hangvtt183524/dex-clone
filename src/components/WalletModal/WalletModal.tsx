/* eslint-disable no-unused-expressions */
import { Checkbox } from 'components/Checkbox';
import { Row } from 'components/Layout/Row';
import Modal from 'components/Modal';
import Text from 'components/Text';
import React, { useState } from 'react';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { urlBgCardGrain } from 'styles/colors';
import { walletLocalStorageKey } from 'packages/wagmi/src/wallet';
import Box from '../Box/Box';
import Grid from '../Box/Grid';
import { Login, WalletConfig } from './types';
import WalletCard from './WalletCard';

interface Props<T> {
  login: Login<T>;
  onDismiss?: () => void;
  displayCount?: number;
  wallets: WalletConfig<T>[];
}

const WalletWrapper = styled(Box)``;

const getPriority = (priority: WalletConfig['priority']) => (typeof priority === 'function' ? priority() : priority);

/**
 * Checks local storage if we have saved the last wallet the user connected with
 * If we find something we put it at the top of the list
 *
 * @returns sorted config
 */
function getPreferredConfig<T>(walletConfig: WalletConfig<T>[]) {
  const sortedConfig = walletConfig.sort(
    (a: WalletConfig<T>, b: WalletConfig<T>) => getPriority(a.priority) - getPriority(b.priority),
  );

  const preferredWalletName = localStorage?.getItem(walletLocalStorageKey);

  if (!preferredWalletName) {
    return sortedConfig;
  }

  const preferredWallet = sortedConfig.find((sortedWalletConfig) => sortedWalletConfig.title === preferredWalletName);

  if (!preferredWallet) {
    return sortedConfig;
  }

  return [
    preferredWallet,
    ...sortedConfig.filter((sortedWalletConfig) => sortedWalletConfig.title !== preferredWalletName),
  ];
}

const WalletModal = <T,>({ login, onDismiss = () => null, displayCount = 5, wallets: connectors }: Props<T>) => {
  const [confirmed, setConfirmed] = useState(false);
  // const [showMore, setShowMore] = useState(false);
  const sortedConfig = getPreferredConfig(connectors);
  // Filter out WalletConnect if user is inside TrustWallet built-in browser
  // const walletsToShow = window.ethereum?.isTrust;
  // @ts-ignore
  // !window?.ethereum?.isSafePal ? sortedConfig.filter((wallet) => wallet.title !== 'WalletConnect') : sortedConfig;

  const displayListConfig = sortedConfig.slice(0, displayCount);
  // showMore ? sortedConfig :

  const handleToggleCheckBox = () => {
    setConfirmed(!confirmed);
  };

  const handleOpenConditionsAndTerms = (event, url) => {
    event.stopPropagation();
    window.open(url, '_blank');
  }

  return (
    <Modal title="Connect Wallet" onDismiss={onDismiss} maxWidth="340px" width="96% !important" margin="0 auto">
      <StyledCardCondition $active={confirmed} onClick={handleToggleCheckBox}>
        <Box>
          <Checkbox scale="sm" name="confirmed" type="checkbox" checked={confirmed} onChange={handleToggleCheckBox} />
        </Box>
        <StyledTextCondition ml="12px">
          I have read and agree to{' '}
          <StyledTextCondition gradient={RoboTheme.colors.gradients.primary} fontWeight={700} onClick={(event) => {handleOpenConditionsAndTerms(event, 'https://roboglobal.info/term')}}>
            Conditions and Terms of Use.
          </StyledTextCondition>
        </StyledTextCondition>
      </StyledCardCondition>

      <WalletWrapper py="24px" maxHeight="453px" overflowY="auto">
        <Grid gridColumnGap="14px" gridRowGap="16px" gridTemplateColumns="1fr 1fr">
          {displayListConfig.map((wallet) => (
            <WalletCard
              walletConfig={wallet}
              key={wallet.title}
              login={login}
              onDismiss={onDismiss}
              disabled={!confirmed}
            />
          ))}
          {/* {!showMore && sortedConfig.length > 4 && <MoreWalletCard onClick={() => setShowMore(true)} />} */}
        </Grid>
      </WalletWrapper>
    </Modal>
  );
};

const StyledCardCondition = styled(Row)<{ $active: boolean }>`
  cursor: pointer;

  margin-top: 12px;
  padding: 8px 20px;

  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme, $active }) =>
    $active
      ? `url(${urlBgCardGrain}), linear-gradient(180deg, rgba(52, 58, 66, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)`
      : theme.colors.gradients.disabled};
`;

const StyledTextCondition = styled(Text).attrs({
  display: 'inline-block',
  fontSize: '12px',
  color: 'textSubtle',
  lineHeight: '18px',
})``;

export default WalletModal;
