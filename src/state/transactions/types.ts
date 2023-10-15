// import { VoteOption } from '../governance/types'

import { SupportedChainId, TradeType } from 'config/sdk-core';

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

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  APPROVAL = 0,
  SWAP,
  DEPOSIT_LIQUIDITY_STAKING,
  WITHDRAW_LIQUIDITY_STAKING,
  WRAP,
  CREATE_V3_POOL,
  ADD_LIQUIDITY_V3_POOL,
  ADD_LIQUIDITY_V2_POOL,
  MIGRATE_LIQUIDITY_V3,
  REMOVE_LIQUIDITY_V3,
  STAKE_FARM,
  UNSTAKE_FARM,
  HARVEST_FARM,
  APPROVAL_FARM,
}

export interface BaseTransactionInfo {
  type: TransactionType;
}

export interface ApproveTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.APPROVAL;
  tokenAddress: string;
  spender: string;
}

interface BaseSwapTransactionInfo extends BaseTransactionInfo {
  type: TransactionType.SWAP;
  tradeType: TradeType;
  inputCurrencyId: string;
  outputCurrencyId: string;
}

export interface ExactInputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_INPUT;
  inputCurrencyAmountRaw: string;
  expectedOutputCurrencyAmountRaw: string;
  minimumOutputCurrencyAmountRaw: string;
}
export interface ExactOutputSwapTransactionInfo extends BaseSwapTransactionInfo {
  tradeType: TradeType.EXACT_OUTPUT;
  outputCurrencyAmountRaw: string;
  expectedInputCurrencyAmountRaw: string;
  maximumInputCurrencyAmountRaw: string;
}

export interface WrapTransactionInfo {
  type: TransactionType.WRAP;
  unwrapped: boolean;
  currencyAmountRaw: string;
  chainId?: number;
}

export interface CreateV3PoolTransactionInfo {
  type: TransactionType.CREATE_V3_POOL;
  baseCurrencyId: string;
  quoteCurrencyId: string;
}

export interface AddLiquidityV3PoolTransactionInfo {
  type: TransactionType.ADD_LIQUIDITY_V3_POOL;
  createPool: boolean;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  feeAmount: number;
  expectedAmountBaseRaw: string;
  expectedAmountQuoteRaw: string;
}

export interface AddLiquidityV2PoolTransactionInfo {
  type: TransactionType.ADD_LIQUIDITY_V2_POOL;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  expectedAmountBaseRaw: string;
  expectedAmountQuoteRaw: string;
}

export interface MigrateV2LiquidityToV3TransactionInfo {
  type: TransactionType.MIGRATE_LIQUIDITY_V3;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  isFork: boolean;
}

export interface RemoveLiquidityV3TransactionInfo {
  type: TransactionType.REMOVE_LIQUIDITY_V3;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  expectedAmountBaseRaw: string;
  expectedAmountQuoteRaw: string;
}

export interface StakingFarmTransactionInfo {
  type: TransactionType.STAKE_FARM | TransactionType.UNSTAKE_FARM;
  amount: string;
  manager: string;
  pid: number;
  chainId: SupportedChainId;
}
export interface HarvestFarmTransactionInfo {
  type: TransactionType.HARVEST_FARM;
  pid: number;
  manager: string;
  amount: string;
  chainId: SupportedChainId;
}

export interface ApprovalFarmTransactionInfo {
  type: TransactionType.APPROVAL_FARM;
  pid: number;
  manager: string;
  tokenAddress: string;
  spender: string;
  chainId: SupportedChainId;
}

export type TransactionInfo =
  | ApproveTransactionInfo
  | ExactOutputSwapTransactionInfo
  | ExactInputSwapTransactionInfo
  | WrapTransactionInfo
  | CreateV3PoolTransactionInfo
  | AddLiquidityV3PoolTransactionInfo
  | AddLiquidityV2PoolTransactionInfo
  | MigrateV2LiquidityToV3TransactionInfo
  | RemoveLiquidityV3TransactionInfo
  | StakingFarmTransactionInfo
  | HarvestFarmTransactionInfo
  | ApprovalFarmTransactionInfo;

export interface TransactionDetails {
  hash: string;
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
  info: TransactionInfo;
}
