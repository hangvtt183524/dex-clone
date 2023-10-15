import React, { useEffect, useRef } from 'react';
import merge from 'lodash/merge';
import pickBy from 'lodash/pickBy';
import forEach from 'lodash/forEach';
import { poll } from '@ethersproject/web';
import { useAppDispatch } from 'state/store';
import useToast from 'hooks/useToast';
import ToastDescriptionWithTx from 'components/Toast/ToastDescriptionWithTx';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';

import { useAllChainTransactions } from './hooks';
import { finalizeTransaction } from './actions';
import { TransactionDetails } from './types';

export function shouldCheck(
  fetchedTransactions: { [txHash: string]: TransactionDetails },
  tx: TransactionDetails,
): boolean {
  if (tx.receipt) return false;
  return !fetchedTransactions[tx.hash];
}

export const Updater: React.FC = () => {
  const { provider, chainId } = useActiveWeb3React();

  // const { t } = useTranslation()

  const dispatch = useAppDispatch();
  const transactions = useAllChainTransactions(chainId);

  const { toastError, toastSuccess } = useToast();

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>({});

  useEffect(() => {
    if (!chainId || !provider) return;
    forEach(
      pickBy(transactions, (transaction) => shouldCheck(fetchedTransactions.current, transaction)),
      (transaction) => {
        const getTransaction = async () => {
          const params = {
            transactionHash: provider.formatter.hash(transaction.hash, true),
          };

          poll(
            async () => {
              const result = await provider.perform('getTransactionReceipt', params);

              if (result == null || result?.blockHash == null) {
                return undefined;
              }

              const receipt = provider.formatter.receipt(result);

              dispatch(
                finalizeTransaction({
                  chainId,
                  hash: transaction.hash,
                  receipt: {
                    blockHash: receipt?.blockHash,
                    blockNumber: receipt?.blockNumber,
                    contractAddress: receipt?.contractAddress || '',
                    from: receipt?.from || '',
                    status: receipt?.status || 0,
                    to: receipt?.to || '',
                    transactionHash: receipt?.transactionHash || transaction.hash,
                    transactionIndex: receipt?.transactionIndex || 0,
                  },
                }),
              );

              const isSuccess = receipt.status === 1;

              const toast = isSuccess ? toastSuccess : toastError;
              toast(
                `Transaction ${isSuccess ? 'successful' : 'failure'}`,
                <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={chainId} />,
              );
              return true;
            },
            { onceBlock: provider },
          );
          merge(fetchedTransactions.current, {
            [transaction.hash]: transactions[transaction.hash],
          });
        };

        getTransaction();
      },
    );
  }, [chainId, provider, transactions, dispatch, toastSuccess, toastError]);

  return null;
};

export default Updater;
