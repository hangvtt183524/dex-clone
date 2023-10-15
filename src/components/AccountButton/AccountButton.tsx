import { Box, Grid } from 'components/Box';
import Button from 'components/Button';
// import ButtonBorderGradient from 'components/Button/ButtonBorderGradient';
import ConnectButton from 'components/ConnectButton';
import { RowFixed } from 'components/Layout/Row';
import CircleLoaderMini from 'components/Loader/CircleLoaderMini';
import Text from 'components/Text';
import useMatchBreakPoints from 'hooks/useMatchBreakPoints';
import { useFindWallet } from 'hooks/useWallet';
import React, {useEffect, useMemo} from 'react';
import { useAllTransactions } from 'state/transactions/hooks';
import { DownIcon, HelpIcon } from 'svgs';
import { truncateHash } from 'utils/addressHelpers';
import {useAccount, useWeb3React} from 'packages/wagmi/src';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import RoboTheme from 'styles';
// import styled from 'styled-components';
import { useFetchFarmWithUserData } from 'state/farms/hooks';
import UserMenuDropdown from './UserMenuDropdown';

// const StyledButtonBorderGradient = styled(ButtonBorderGradient)`
//   ${Text} {
//     display: none;
//   }
//
//   ${({ theme }) => theme.mediaQueries.sm} {
//     ${Text} {
//       display: flex;
//     }
//   }
// `;

const AccountButton = () => {
  const { address, isConnected } = useAccount();
  const { connector } = useWeb3React();
  const { chainId } = useActiveWeb3React();
  const refreshFarmData = useFetchFarmWithUserData();

  const { isDesktop } = useMatchBreakPoints();
  const wallet = useFindWallet();
  const Icon = (wallet?.icon as any) || null;

  const allTransactions = useAllTransactions();
  const allTransactionByChain = useMemo(() => allTransactions[chainId] ?? {}, [allTransactions, chainId]);

  const pendingTransactions = useMemo(
    () => Object.values(allTransactionByChain).filter((tx) => !tx.receipt),
    [allTransactionByChain],
  );

  useEffect(() => {
     if (address && isConnected && connector && chainId) {

        refreshFarmData().then((result) => {
        });
     }
  }, [address, isConnected, connector, chainId]);

  const START_ADDRESS = isDesktop ? 6 : 4;
  const END_ADDRESS = isDesktop ? 8 : 6;

  const renderAccountButton = useMemo(
    () => (
      // <StyledButtonBorderGradient background="topbar" height="42px">
        <Grid
          gridGap="8px"
          gridTemplateColumns="repeat(3, auto)"
          style={{ display: 'flex', alignItems: 'center' }}
          width="100%"
        >
          <RowFixed>{wallet ? <Icon width={24} /> : <HelpIcon fill={RoboTheme.colors.textSubtle} />}</RowFixed>
          <Text fontWeight={600}>{truncateHash(address || '', START_ADDRESS, END_ADDRESS)}</Text>
          <RowFixed ml="8px">
            <DownIcon />
          </RowFixed>
        </Grid>
      // </StyledButtonBorderGradient>
    ),
    [END_ADDRESS, Icon, START_ADDRESS, address, wallet],
  );

  return isConnected && address ? (
    <UserMenuDropdown>
      {pendingTransactions.length > 0 ? (
        <Button
          p="12px 20px"
          style={{
            fontSize: '14px',
            lineHeight: '16px',
            alignItems: 'center',
          }}
        >
          {pendingTransactions.length} pending
          <Box as="span" ml="4px" mt="4px">
            <CircleLoaderMini stroke="#FFF" />
          </Box>{' '}
        </Button>
      ) : (
        renderAccountButton
      )}
    </UserMenuDropdown>
  ) : (
    <ConnectButton height="44px" />
  );
};

export default AccountButton;
