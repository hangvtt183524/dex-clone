/* eslint-disable max-len */
import { Native } from 'config/native';
import { Fraction, TradeType } from 'config/sdk-core';
import JSBI from 'jsbi';
import React from 'react';
import { Trans } from 'react-i18next';

import { useCurrency, useToken } from '../../hooks/Tokens';
import {
  AddLiquidityV2PoolTransactionInfo,
  AddLiquidityV3PoolTransactionInfo,
  ApproveTransactionInfo,
  CreateV3PoolTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  MigrateV2LiquidityToV3TransactionInfo,
  RemoveLiquidityV3TransactionInfo,
  TransactionInfo,
  TransactionType,
  WrapTransactionInfo,
} from '../../state/transactions/types';

function formatAmount(amountRaw: string, decimals: number, sigFigs: number): string {
  return new Fraction(amountRaw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))).toSignificant(sigFigs);
}

const FormattedCurrencyAmount = ({
  rawAmount,
  symbol,
  decimals,
  sigFigs,
}: {
  rawAmount: string;
  symbol: string;
  decimals: number;
  sigFigs: number;
}) => {
  return (
    <>
      {formatAmount(rawAmount, decimals, sigFigs)} {symbol}
    </>
  );
};

const FormattedCurrencyAmountManaged = ({
  rawAmount,
  currencyId,
  sigFigs = 6,
}: {
  rawAmount: string;
  currencyId: string;
  sigFigs: number;
}) => {
  const currency = useCurrency(currencyId);
  return currency ? (
    <FormattedCurrencyAmount
      rawAmount={rawAmount}
      decimals={currency.decimals}
      sigFigs={sigFigs}
      symbol={currency.symbol ?? '???'}
    />
  ) : null;
};

const ApprovalSummary = ({ info }: { info: ApproveTransactionInfo }) => {
  const token = useToken(info.tokenAddress);

  return <Trans>Approve {token?.symbol}</Trans>;
};

const WrapSummary = ({ info: { chainId, currencyAmountRaw, unwrapped } }: { info: WrapTransactionInfo }) => {
  const native = chainId ? Native.onChain(chainId) : undefined;

  if (unwrapped) {
    return (
      <Trans>
        Unwrap{' '}
        <FormattedCurrencyAmount
          rawAmount={currencyAmountRaw}
          symbol={native?.wrapped?.symbol ?? 'WETH'}
          decimals={18}
          sigFigs={6}
        />{' '}
        to {native?.symbol ?? 'ETH'}
      </Trans>
    );
  }
  return (
    <Trans>
      Wrap{' '}
      <FormattedCurrencyAmount
        rawAmount={currencyAmountRaw}
        symbol={native?.symbol ?? 'ETH'}
        decimals={18}
        sigFigs={6}
      />{' '}
      to {native?.wrapped?.symbol ?? 'WETH'}
    </Trans>
  );
};

const MigrateLiquidityToV3Summary = ({
  info: { baseCurrencyId, quoteCurrencyId },
}: {
  info: MigrateV2LiquidityToV3TransactionInfo;
}) => {
  const baseCurrency = useCurrency(baseCurrencyId);
  const quoteCurrency = useCurrency(quoteCurrencyId);

  return (
    <Trans>
      Migrate {baseCurrency?.symbol}/{quoteCurrency?.symbol} liquidity to V3
    </Trans>
  );
};

const CreateV3PoolSummary = ({ info: { quoteCurrencyId, baseCurrencyId } }: { info: CreateV3PoolTransactionInfo }) => {
  const baseCurrency = useCurrency(baseCurrencyId);
  const quoteCurrency = useCurrency(quoteCurrencyId);

  return (
    <Trans>
      Create {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 pool
    </Trans>
  );
};

const RemoveLiquidityV3Summary = ({
  info: { baseCurrencyId, quoteCurrencyId, expectedAmountBaseRaw, expectedAmountQuoteRaw },
}: {
  info: RemoveLiquidityV3TransactionInfo;
}) => {
  return (
    <Trans>
      Remove{' '}
      <FormattedCurrencyAmountManaged rawAmount={expectedAmountBaseRaw} currencyId={baseCurrencyId} sigFigs={3} /> and{' '}
      <FormattedCurrencyAmountManaged rawAmount={expectedAmountQuoteRaw} currencyId={quoteCurrencyId} sigFigs={3} />
    </Trans>
  );
};

const AddLiquidityV3PoolSummary = ({
  info: { createPool, quoteCurrencyId, baseCurrencyId },
}: {
  info: AddLiquidityV3PoolTransactionInfo;
}) => {
  const baseCurrency = useCurrency(baseCurrencyId);
  const quoteCurrency = useCurrency(quoteCurrencyId);

  return createPool ? (
    <Trans>
      Create pool and add {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 liquidity
    </Trans>
  ) : (
    <Trans>
      Add {baseCurrency?.symbol}/{quoteCurrency?.symbol} V3 liquidity
    </Trans>
  );
};

const AddLiquidityV2PoolSummary = ({
  info: { quoteCurrencyId, expectedAmountBaseRaw, expectedAmountQuoteRaw, baseCurrencyId },
}: {
  info: AddLiquidityV2PoolTransactionInfo;
}) => {
  return (
    <Trans>
      Add <FormattedCurrencyAmountManaged rawAmount={expectedAmountBaseRaw} currencyId={baseCurrencyId} sigFigs={3} />{' '}
      and <FormattedCurrencyAmountManaged rawAmount={expectedAmountQuoteRaw} currencyId={quoteCurrencyId} sigFigs={3} />{' '}
      to RoboEx
    </Trans>
  );
};

const SwapSummary = ({ info }: { info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo }) => {
  if (info.tradeType === TradeType.EXACT_INPUT) {
    return (
      <Trans>
        Swap exactly{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.inputCurrencyAmountRaw}
          currencyId={info.inputCurrencyId}
          sigFigs={6}
        />{' '}
        for{' '}
        <FormattedCurrencyAmountManaged
          rawAmount={info.expectedOutputCurrencyAmountRaw}
          currencyId={info.outputCurrencyId}
          sigFigs={6}
        />
      </Trans>
    );
  }
  return (
    <Trans>
      Swap{' '}
      <FormattedCurrencyAmountManaged
        rawAmount={info.expectedInputCurrencyAmountRaw}
        currencyId={info.inputCurrencyId}
        sigFigs={6}
      />{' '}
      for exactly{' '}
      <FormattedCurrencyAmountManaged
        rawAmount={info.outputCurrencyAmountRaw}
        currencyId={info.outputCurrencyId}
        sigFigs={6}
      />
    </Trans>
  );
};

export const TransactionSummary = ({ info }: { info: TransactionInfo }) => {
  switch (info.type) {
    case TransactionType.ADD_LIQUIDITY_V3_POOL:
      return <AddLiquidityV3PoolSummary info={info} />;

    case TransactionType.ADD_LIQUIDITY_V2_POOL:
      return <AddLiquidityV2PoolSummary info={info} />;

    case TransactionType.SWAP:
      return <SwapSummary info={info} />;

    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} />;

    case TransactionType.WRAP:
      return <WrapSummary info={info} />;

    case TransactionType.CREATE_V3_POOL:
      return <CreateV3PoolSummary info={info} />;

    case TransactionType.MIGRATE_LIQUIDITY_V3:
      return <MigrateLiquidityToV3Summary info={info} />;

    case TransactionType.REMOVE_LIQUIDITY_V3:
      return <RemoveLiquidityV3Summary info={info} />;

    default:
      return <></>;
  }
};
