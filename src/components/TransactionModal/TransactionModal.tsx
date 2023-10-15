import { Box, BoxProps } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import { Card } from 'components/Card';
import { RowBetween, RowCenter } from 'components/Layout/Row';
import { InjectedModalProps } from 'components/Modal';
import { ModalBody, ModalCloseButton, ModalContainer } from 'components/Modal/styles';
import Text from 'components/Text';
import { SupportedChainId } from 'config/sdk-core';
import { getYear, isSameDay, isSameWeek, isSameYear } from 'date-fns';
import ms from 'ms.macro';
import { Trans } from 'react-i18next';
import React, { useCallback, useMemo } from 'react';
import { useAppDispatch } from 'state/store';
import { clearAllTransactions } from 'state/transactions/actions';
import styled from 'styled-components/macro';

import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useAllTransactions } from '../../state/transactions/hooks';
import { TransactionDetails } from '../../state/transactions/types';
import TransactionStatus from './TransactionStatus';

const THIRTY_DAYS = ms`30 days`;

const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle}47;
`;

const TransactionListWrapper = styled(Box)`
  padding-bottom: 12px;
`;

interface TransactionInformation {
  title: string;
  transactions: TransactionDetails[];
}

const TransactionTitle = styled(Text)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSubtle};
  padding: 24px 24px 12px;
`;

const TransactionList = ({ transactionInformation }: { transactionInformation: TransactionInformation }) => {
  const { title, transactions } = transactionInformation;

  return (
    <TransactionListWrapper key={title}>
      <TransactionTitle>{title}</TransactionTitle>
      {transactions.map((transactionDetails) => (
        <TransactionStatus key={transactionDetails.hash} transactionDetails={transactionDetails} />
      ))}
    </TransactionListWrapper>
  );
};

const getConfirmedTransactions = (confirmedTransactions: Array<TransactionDetails>) => {
  const now = new Date().getTime();

  const today: Array<TransactionDetails> = [];
  const currentWeek: Array<TransactionDetails> = [];
  const last30Days: Array<TransactionDetails> = [];
  const currentYear: Array<TransactionDetails> = [];
  const yearMap: { [key: string]: Array<TransactionDetails> } = {};

  confirmedTransactions.forEach((transaction) => {
    const { addedTime } = transaction;

    if (isSameDay(now, addedTime)) {
      today.push(transaction);
    } else if (isSameWeek(addedTime, now)) {
      currentWeek.push(transaction);
    } else if (now - addedTime < THIRTY_DAYS) {
      last30Days.push(transaction);
    } else if (isSameYear(addedTime, now)) {
      currentYear.push(transaction);
    } else {
      const year = getYear(addedTime);

      if (!yearMap[year]) {
        yearMap[year] = [transaction];
      } else {
        yearMap[year].push(transaction);
      }
    }
  });

  const transactionGroups: Array<TransactionInformation> = [
    {
      title: 'Today',
      transactions: today,
    },
    {
      title: 'This week',
      transactions: currentWeek,
    },
    {
      title: 'Past 30 Days',
      transactions: last30Days,
    },
    {
      title: 'This year',
      transactions: currentYear,
    },
  ];

  const sortedYears = Object.keys(yearMap)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map((year) => ({ title: year, transactions: yearMap[year] }));

  transactionGroups.push(...sortedYears);

  return transactionGroups.filter((transactionInformation) => transactionInformation.transactions.length > 0);
};

export const TransactionListDetail: React.FC<BoxProps & { chainId: SupportedChainId }> = ({ chainId, ...props }) => {
  const allTransactions = useAllTransactions();
  const transactionGroupsInformation = [];
  const [confirmed, pending] = useMemo(() => {
    const confirmed: Array<TransactionDetails> = [];
    const pending: Array<TransactionDetails> = [];

    const sorted = Object.values(allTransactions?.[chainId] ?? {}).sort((a, b) => b.addedTime - a.addedTime);
    sorted.forEach((transaction) => (transaction.receipt ? confirmed.push(transaction) : pending.push(transaction)));

    return [confirmed, pending];
  }, [allTransactions, chainId]);

  const confirmedTransactions = useMemo(() => getConfirmedTransactions(confirmed), [confirmed]);

  if (pending.length)
    transactionGroupsInformation.push({
      title: `Pending (${pending.length})`,
      transactions: pending,
    });
  if (confirmedTransactions.length) transactionGroupsInformation.push(...confirmedTransactions);

  return (
    <ModalBody minHeight="300px" maxHeight="500px" {...props}>
      {transactionGroupsInformation.length > 0 ? (
        <>
          {transactionGroupsInformation.map((transactionInformation) => (
            <TransactionList key={transactionInformation.title} transactionInformation={transactionInformation} />
          ))}
        </>
      ) : (
        <RowCenter flex={1} height="inherit" p={['12px', '24px']}>
          <Text fontWeight={400} fontSize="14px" data-testid="wallet-empty-transaction-text">
            <Trans>Your transactions will appear here</Trans>
          </Text>
        </RowCenter>
      )}
    </ModalBody>
  );
};

const TransactionModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <ModalContainer width="100%" minWidth={['320px !important', '', '390px !important']} maxWidth="500px">
      <Card variant="modal" p="0 !important">
        <RowBetween p={['12px', '24px']}>
          <ModalCloseButton onDismiss={onDismiss} />
          <Text scale="xl" fontWeight="600">
            Transactions
          </Text>
          <IconButton onClick={clearAllTransactionsCallback}>
            <Text color="textSubtle" fontSize="12px">
              Clear All
            </Text>
          </IconButton>
        </RowBetween>
        <Divider />

        <TransactionListDetail chainId={chainId} />
      </Card>
    </ModalContainer>
  );
};

export default TransactionModal;
