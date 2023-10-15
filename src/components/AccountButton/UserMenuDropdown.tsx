import { Box, Grid } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import IconButtonBG from 'components/Button/IconButtonBG';
import IconButtonStatus from 'components/Button/IconButtonStatus';
import { Card } from 'components/Card';
import DropdownMenu from 'components/DropdownMenu';
import { ColumnCenter } from 'components/Layout/Column';
import { RowBetween, RowCenter, RowFixed, RowMiddle } from 'components/Layout/Row';
import Link from 'components/Link';
import { getExternalLinkProps } from 'components/Link/Link';
import Text from 'components/Text';
import { TransactionListDetail } from 'components/TransactionModal/TransactionModal';
import { CurrencyAmount } from 'config/sdk-core';
import { NATIVE_TOKEN } from 'config/tokens';
import useAuth from 'hooks/useAuth';
import { useNativeBalances } from 'hooks/useBalances';
import { useStableUSDValue } from 'hooks/usePrices/useStablecoinPrice';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useAccount } from 'packages/wagmi/src';
import { walletLocalStorageKey, wallets } from 'packages/wagmi/src/wallet';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { useAppDispatch } from 'state/store';
import { clearAllTransactions } from 'state/transactions/actions';
import { useAllTransactions } from 'state/transactions/hooks';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect'
import {
  ArrowLeftBackIcon,
  ArrowRightIcon,
  CopyIcon,
  DisconnectIcon,
  FindDocsIcon,
  GlobalIcon,
  HelpIcon,
  HistoryIcon,
  MoonIcon,
  SettingHorizonIcon,
} from 'svgs';
import { truncateHash } from 'utils/addressHelpers';
import { copyContent } from 'utils/copy';
import { getExplorerLink } from 'utils/getExplorer';
import useTooltip from 'hooks/useTooltip';
import { explainField } from 'config/explain';

const StyledPaddingX = styled(Box)`
  padding-left: 12px;
  padding-right: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const Wrapper = styled(Card)`
  background: ${({ theme }) => theme.colors.modal};
  border-radius: 0;
  width: 100%;
  max-width: 350px;
  padding-right: 0;
  padding-left: 0;
`;

const Stroke = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.colors.strokeAlt};
`;

const ItemDropAccount = styled(IconButton)`
  width: 100%;
  padding: 12px 24px;
  border-radius: 0;
  justify-content: space-between;
`;

const DefaultContentDropdown: React.FC<{ setMenu }> = ({ setMenu }) => {
  const { address, isConnected } = useAccount();
  const { chainId } = useActiveWeb3React();

  const nameWallet = localStorage.getItem(walletLocalStorageKey);

  const wallet = useMemo(
    () => nameWallet && wallets.find((itemWallet) => itemWallet.title.toUpperCase() === nameWallet.toUpperCase()),
    [nameWallet],
  );
  const Icon = (wallet?.icon as any) || null;

  const { logout } = useAuth();
  const allTransactions = useAllTransactions();
  const allTransactionByChain = useMemo(() => allTransactions[chainId] ?? {}, [allTransactions, chainId]);

  const pendingTransactions = useMemo(
    () => Object.values(allTransactionByChain).filter((tx) => !tx.receipt),
    [allTransactionByChain],
  );

  const balanceNative = useNativeBalances([address])?.[address] ?? null;

  const nativeCurrencyPrice = useStableUSDValue(
    balanceNative?.greaterThan(0)
      ? CurrencyAmount.fromRawAmount(NATIVE_TOKEN[chainId], balanceNative.quotient.toString())
      : null,
  );

  const amountUSD = useMemo(() => {
    const price = nativeCurrencyPrice?.greaterThan(0) ? nativeCurrencyPrice : 0;
    const visibleDecimalPlaces = Number(price.toFixed()) < 1.05 ? 4 : 2;
    return nativeCurrencyPrice?.toFixed(visibleDecimalPlaces, { groupSeparator: ',' }) || 0;
  }, [nativeCurrencyPrice]);

  const {
    targetRef: targetRefCopyAddress,
    tooltip: tooltipCopyAddress,
    tooltipVisible: tooltipVisibleCopyAddress,
  } = useTooltip(explainField.copy, {
    placement: 'top',
    trigger: 'hover',
  });

  const {
    targetRef: targetRefScan,
    tooltip: tooltipScan,
    tooltipVisible: tooltipVisibleScan,
  } = useTooltip(explainField.findDoc, {
    placement: 'top',
    trigger: 'hover',
  });

  const {
    targetRef: targetRefLogout,
    tooltip: tooltipLogout,
    tooltipVisible: tooltipVisibleLogout,
  } = useTooltip(explainField.disconnect, {
    placement: 'top',
    trigger: 'hover',
  });

  return (
    isConnected && (
      <Wrapper>
        <StyledPaddingX>
          <RowBetween width="100%">
            <RowFixed>
              {wallet ? <Icon width={24} /> : <HelpIcon color="textSubtle" />}

              <Text fontWeight={500} ml="8px">
                {truncateHash(address, 6, 6)}
              </Text>
            </RowFixed>

            {isMobile ? (
                <Grid gridTemplateColumns="repeat(3, 1fr)" gridGap="8px">
                    <IconButtonStatus
                        p="0"
                        radius="small"
                        width="36px !important"
                        height="36px !important"
                        onClick={() => copyContent(address)}
                    >
                        <IconButtonBG
                            p="0"
                            radius="small"
                            width="36px !important"
                            height="36px !important"
                        >
                            <CopyIcon />
                        </IconButtonBG>
                    </IconButtonStatus>
                    <Link href={getExplorerLink(address, 'address', chainId)} {...getExternalLinkProps()}>
                        <IconButtonBG p="0" radius="small" width="36px !important" height="36px !important">
                            <FindDocsIcon />
                        </IconButtonBG>
                    </Link>
                    <IconButtonBG
                        p="0"
                        radius="small"
                        width="36px !important"
                        height="36px !important"
                        onClick={logout}
                    >
                        <DisconnectIcon />
                    </IconButtonBG>
                </Grid>
            ) : (
                <Grid gridTemplateColumns="repeat(3, 1fr)" gridGap="8px">
                    <IconButtonStatus
                        p="0"
                        radius="small"
                        width="36px !important"
                        height="36px !important"
                        onClick={() => copyContent(address)}
                    >
                        <IconButtonBG
                            p="0"
                            radius="small"
                            width="36px !important"
                            height="36px !important"
                            ref={targetRefCopyAddress}
                        >
                            <CopyIcon />
                            {tooltipVisibleCopyAddress && tooltipCopyAddress}
                        </IconButtonBG>
                    </IconButtonStatus>
                    <Link href={getExplorerLink(address, 'address', chainId)} {...getExternalLinkProps()}>
                        <IconButtonBG p="0" radius="small" width="36px !important" height="36px !important" ref={targetRefScan}>
                            <FindDocsIcon />
                            {tooltipVisibleScan && tooltipScan}
                        </IconButtonBG>
                    </Link>
                    <IconButtonBG
                        p="0"
                        radius="small"
                        width="36px !important"
                        height="36px !important"
                        onClick={logout}
                        ref={targetRefLogout}
                    >
                        <DisconnectIcon />
                        {tooltipVisibleLogout && tooltipLogout}
                    </IconButtonBG>
                </Grid>
            )}
          </RowBetween>
        </StyledPaddingX>

        <RowCenter my="24px">
          <ColumnCenter>
            <Text fontSize="24px">{balanceNative ? balanceNative.toExact() : 0} ETH</Text>
            <Text fontSize="16px" mt="4px" color="textSubtle">
              ${amountUSD}
            </Text>
          </ColumnCenter>
        </RowCenter>
        <Stroke />
        <ItemDropAccount onClick={() => setMenu(MenuState.TRANSACTIONS)}>
          <RowMiddle>
            <HistoryIcon width="24px" />
            <Text ml="8px" color="textSubtle" style={{ display: 'flex', alignItems: 'center' }}>
              Transactions ({Object.values(allTransactionByChain).length || 0})
              {pendingTransactions.length > 0 && (
                <Text color="warning" ml="8px">
                  {pendingTransactions.length} <Trans>Pending</Trans>
                </Text>
              )}
            </Text>
          </RowMiddle>
          <RowFixed>
            <ArrowRightIcon />
          </RowFixed>
        </ItemDropAccount>
        <ItemDropAccount>
          <RowMiddle>
            <GlobalIcon width="24px" />
            <Text ml="8px" color="textSubtle">
              Language
            </Text>
          </RowMiddle>
          <RowFixed>
            <Text>EN</Text>
            <ArrowRightIcon />
          </RowFixed>
        </ItemDropAccount>
        <ItemDropAccount>
          <RowMiddle>
            <SettingHorizonIcon width="24px" />
            <Text ml="8px" color="textSubtle">
              Theme
            </Text>
          </RowMiddle>
          <RowFixed>
            <MoonIcon />
          </RowFixed>
        </ItemDropAccount>
      </Wrapper>
    )
  );
};

const WrapperTransactionListDetail: React.FC<{ setMenu }> = ({ setMenu }) => {
  const { chainId } = useActiveWeb3React();

  const dispatch = useAppDispatch();
  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <Wrapper>
      <StyledPaddingX pb="12px">
        <RowBetween width="100%">
          <IconButton
            width="44px"
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
            onClick={() => setMenu(MenuState.DEFAULT)}
          >
            <ArrowLeftBackIcon />
          </IconButton>

          <Text fontSize="18px">Transactions</Text>
          <IconButton onClick={clearAllTransactionsCallback}>
            <Text fontSize="10px" color="textSubtle">
              Clear All
            </Text>
          </IconButton>
        </RowBetween>
      </StyledPaddingX>
      <TransactionListDetail maxHeight="400px" chainId={chainId} />
    </Wrapper>
  );
};
enum MenuState {
  DEFAULT = 'DEFAULT',
  LANGUAGE = 'LANGUAGE',
  TRANSACTIONS = 'TRANSACTIONS',
}

const UserMenuDropdown: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuState>(MenuState.DEFAULT);

  const renderContent = useMemo(() => {
    switch (menu) {
      case MenuState.TRANSACTIONS:
        return <WrapperTransactionListDetail setMenu={setMenu} />;
      default:
        return <DefaultContentDropdown setMenu={setMenu} />;
    }
  }, [menu]);
  return (
    <DropdownMenu trigger="click" maxWidthContent={350} content={renderContent} placement="bottom-end">
      {children}
    </DropdownMenu>
  );
};

export default React.memo(UserMenuDropdown);
