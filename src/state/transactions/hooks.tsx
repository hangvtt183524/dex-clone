import { TransactionResponse } from '@ethersproject/providers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'state/store';
import fromPairs from 'lodash/fromPairs';
import mapValues from 'lodash/mapValues';
import keyBy from 'lodash/keyBy';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import { Token } from 'config/sdk-core';
import { get } from 'lodash';
import { useAccount } from 'packages/wagmi/src';
import { addTransaction } from './actions';
import { TransactionDetails, TransactionInfo, TransactionType } from './types';
import { useSelectedChainNetwork } from '../user/hooks';

export function useTransactionAdder(): (response: TransactionResponse, info: TransactionInfo) => void {
  const { address } = useAccount();
    const chainId = useSelectedChainNetwork();

  const dispatch = useAppDispatch();

  return useCallback(
    (response: TransactionResponse, info: TransactionInfo) => {
      if (!address) return;
      if (!chainId) return;

      const hash = response?.hash || null;
      if (!hash) {
        throw Error('No transaction hash found.');
      }
      dispatch(addTransaction({ hash, from: address, info, chainId }));
    },
    [address, chainId, dispatch],
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): {
  [chainId: number]: { [txHash: string]: TransactionDetails };
} {
  const { address } = useAccount();

  const state: {
    [chainId: number]: {
      [txHash: string]: TransactionDetails;
    };
  } = useAppSelector((s) => s.transactions);

  return useMemo(() => {
    return fromPairs(
      Object.entries(state).map(([chainId, transactions]) => [
        chainId,
        fromPairs(
          Object.entries(transactions).filter(
            ([_, transactionDetails]) => transactionDetails.from.toLowerCase() === address?.toLowerCase(),
          ),
        ),
      ]),
    );
  }, [address, state]);
}

export function useAllSortedRecentTransactions(): {
  [chainId: number]: { [txHash: string]: TransactionDetails };
} {
  const allTransactions = useAllTransactions();
  return useMemo(() => {
    return fromPairs(
      Object.entries(allTransactions)
        .map(([chainId, transactions]) => {
          return [
            chainId,
            mapValues(
              keyBy(
                orderBy(
                  Object.entries(transactions)
                    .filter(([_, trxDetails]) => isTransactionRecent(trxDetails))
                    .map(([hash, trxDetails]) => ({ hash, trxDetails })),
                  ['trxDetails', 'addedTime'],
                  'desc',
                ),
                'hash',
              ),
              'trxDetails',
            ),
          ];
        })
        .filter(([_, transactions]) => !isEmpty(transactions)),
    );
  }, [allTransactions]);
}

export function useAllChainTransactions(chainId: number): {
  [txHash: string]: TransactionDetails;
} {
  const { address } = useAccount();
  const state = useAppSelector((s) => s.transactions);

  return useMemo(() => {
    if (chainId && state[chainId]) {
      return fromPairs(
        Object.entries(state[chainId]).filter(
          ([_, transactionDetails]) => transactionDetails.from.toLowerCase() === address?.toLowerCase(),
        ),
      );
    }
    return {};
  }, [address, chainId, state]);
}
export function useAllActiveChainTransactions(): {
  [txHash: string]: TransactionDetails;
} {
    const chainId = useSelectedChainNetwork();

  return useAllChainTransactions(chainId);
}

export const useTransaction = (transactionHash?: string): TransactionDetails | undefined => {
  const allTransactions = useAllActiveChainTransactions();
  return useMemo(() => allTransactions?.[transactionHash], [allTransactions, transactionHash]);
};

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllActiveChainTransactions();
  return useMemo(() => !transactions?.[transactionHash]?.receipt, [transactions, transactionHash]);
}

export const useCallbackTransactionHash = (callbackSuccess?: () => void) => {
  const [txHash, setTxHash] = useState('');
  const transaction = useTransaction(txHash);

  const callbackHash = useCallback((hash: string) => {
    if (!hash) return;

    setTxHash(hash);
  }, []);

  useEffect(() => {
    if (transaction && callbackSuccess && txHash) {
      if (transaction?.receipt?.status) {
        setTxHash('');
        callbackSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  return useMemo(
    () => ({
      callbackHash,
      txnDetails: transaction,
      successTxn: txHash && transaction?.receipt?.status,
      pendingTxn: txHash && !transaction?.receipt,
    }),
    [callbackHash, transaction, txHash],
  );
};

export function useIsTransactionConfirmed(transactionHash?: string): boolean {
  const transactions = useAllActiveChainTransactions();

  if (!transactionHash || !transactions[transactionHash]) return false;

  return Boolean(transactions[transactionHash].receipt);
}

export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(token?: Token | undefined, spender?: string | undefined): boolean {
    const chainId = useSelectedChainNetwork();

  const allTransactions = useAllTransactions();
  return useMemo(
    () =>
      typeof token?.address === 'string' &&
      typeof spender === 'string' &&
      chainId &&
      Object.keys(get(allTransactions, chainId, [])).some((hash) => {
        const tx = allTransactions?.[chainId]?.[hash];

        if (!tx) return false;
        if (tx.receipt) {
          return false;
        }

        if (tx?.info?.type === TransactionType.APPROVAL || tx?.info?.type === TransactionType.APPROVAL_FARM)
          return tx.info.spender === spender && tx.info.tokenAddress === token.address && isTransactionRecent(tx);

        return false;
      }),
    [allTransactions, chainId, spender, token],
  );
}

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

// calculate pending transactions
export function usePendingTransactions(): {
  hasPendingTransactions: boolean;
  pendingNumber: number;
} {
  const allTransactions = useAllActiveChainTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash);
  const hasPendingTransactions = !!pending.length;

  return {
    hasPendingTransactions,
    pendingNumber: pending.length,
  };
}
