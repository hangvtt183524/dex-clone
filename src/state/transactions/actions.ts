import { createAction } from '@reduxjs/toolkit';
import { SupportedChainId } from 'config/sdk-core';
import { TransactionInfo } from './types';

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}
export const addTransaction = createAction<{
  chainId: SupportedChainId;
  from: string;
  hash: string;
  info: TransactionInfo;
}>('transactions/addTransaction');

export const clearAllTransactions = createAction<{ chainId: SupportedChainId }>('transactions/clearAllTransactions');
export const removeTxn = createAction<{ chainId: SupportedChainId; hash: string }>('transactions/removeTxn');

export const finalizeTransaction = createAction<{
  chainId: SupportedChainId;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>('transactions/finalizeTransaction');
export const checkedTransaction = createAction<{
  chainId: SupportedChainId;
  hash: string;
  blockNumber: number;
}>('transactions/checkedTransaction');
