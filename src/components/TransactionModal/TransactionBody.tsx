/* eslint-disable max-len */
import Text from 'components/Text';
import { Native } from 'config/native';
import { Fraction, TradeType } from 'config/sdk-core';
import JSBI from 'jsbi';
import React from 'react';
import { Trans } from 'react-i18next';
import {
  AddLiquidityV2PoolTransactionInfo,
  AddLiquidityV3PoolTransactionInfo,
  ApproveTransactionInfo,
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  RemoveLiquidityV3TransactionInfo,
  TransactionInfo,
  TransactionType,
  WrapTransactionInfo,
  ApprovalFarmTransactionInfo,
  StakingFarmTransactionInfo,
  HarvestFarmTransactionInfo,
} from 'state/transactions/types';
import styled from 'styled-components';
import { findFarmByManagerAddressAndPid } from 'utils/farms';
import { getFullDecimals, parseNumberDisplay } from 'utils/numbersHelper';

import BigNumber from 'bignumber.js';
import { useCurrency, useToken } from '../../hooks/Tokens';
import { TransactionState } from './types';
import { useFarms } from '../../state/farms/hooks';

const HighlightText = styled(Text).attrs({ as: 'span' })`
  font-weight: 600;
  margin: 0 4px;
  font-size: 14px;
  width: max-content;
`;

const BodyWrap = styled.div`
  line-height: 20px;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

interface ActionProps {
  pending: JSX.Element;
  success: JSX.Element;
  failed: JSX.Element;
  transactionState: TransactionState;
}

const Action = ({ pending, success, failed, transactionState }: ActionProps) => {
  switch (transactionState) {
    case TransactionState.Failed:
      return failed;
    case TransactionState.Success:
      return success;
    default:
      return pending;
  }
};

const formatAmount = (amountRaw: string, decimals: number, sigFigs: number): string => {
  try {
    return new Fraction(amountRaw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))).toSignificant(sigFigs);
  } catch {
    return new Fraction(
      JSBI.BigInt(getFullDecimals(-1, 18).toNumber()),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals)),
    ).toSignificant(sigFigs);
  }
};

const FailedText = ({ transactionState }: { transactionState: TransactionState }) => {
  return transactionState === TransactionState.Failed ? <Trans>failed</Trans> : <span />;
};

const FormattedCurrencyAmount = ({
  rawAmount,
  // sigFigs = 1,
  currencyId,
}: {
  rawAmount: string;
  currencyId: string;
  sigFigs: number;
}) => {
  const currency = useCurrency(currencyId);
  return currency ? (
    <HighlightText>
      {formatAmount(rawAmount, currency.decimals, 6)} {currency.symbol}
    </HighlightText>
  ) : null;
};

const getRawAmounts = (
  info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo,
): { rawAmountFrom: string; rawAmountTo: string } => {
  return info.tradeType === TradeType.EXACT_INPUT
    ? {
        rawAmountFrom: info.inputCurrencyAmountRaw,
        rawAmountTo: info.expectedOutputCurrencyAmountRaw,
      }
    : {
        rawAmountFrom: info.expectedInputCurrencyAmountRaw,
        rawAmountTo: info.outputCurrencyAmountRaw,
      };
};

const SwapSummary = ({
  info,
  transactionState,
}: {
  info: ExactInputSwapTransactionInfo | ExactOutputSwapTransactionInfo;
  transactionState: TransactionState;
}) => {
  const actionProps = {
    transactionState,
    pending: <Trans>Swapping</Trans>,
    success: <Trans>Swapped</Trans>,
    failed: <Trans>Swap</Trans>,
  };
  const { rawAmountFrom, rawAmountTo } = getRawAmounts(info);

  return (
    <BodyWrap>
      <Action {...actionProps} />{' '}
      <FormattedCurrencyAmount rawAmount={rawAmountFrom} currencyId={info.inputCurrencyId} sigFigs={2} />{' '}
      <Trans>for </Trans>{' '}
      <FormattedCurrencyAmount rawAmount={rawAmountTo} currencyId={info.outputCurrencyId} sigFigs={2} />{' '}
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};

const AddLiquidityV3PoolSummary = ({
  info,
  transactionState,
}: {
  info: AddLiquidityV3PoolTransactionInfo;
  transactionState: TransactionState;
}) => {
  const { createPool, quoteCurrencyId, baseCurrencyId } = info;

  const actionProps = {
    transactionState,
    pending: <Trans>Adding</Trans>,
    success: <Trans>Added</Trans>,
    failed: <Trans>Add</Trans>,
  };

  return (
    <BodyWrap>
      {createPool ? (
        <CreateV3PoolSummary info={info} transactionState={transactionState} />
      ) : (
        <>
          <Action {...actionProps} />{' '}
          <FormattedCurrencyAmount rawAmount={info.expectedAmountBaseRaw} currencyId={baseCurrencyId} sigFigs={10} />{' '}
          <Trans>and</Trans>{' '}
          <FormattedCurrencyAmount rawAmount={info.expectedAmountQuoteRaw} currencyId={quoteCurrencyId} sigFigs={10} />
        </>
      )}{' '}
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};

const RemoveLiquidityV3Summary = ({
  info: { baseCurrencyId, quoteCurrencyId, expectedAmountBaseRaw, expectedAmountQuoteRaw },
  transactionState,
}: {
  info: RemoveLiquidityV3TransactionInfo;
  transactionState: TransactionState;
}) => {
  const actionProps = {
    transactionState,
    pending: <Trans>Removing</Trans>,
    success: <Trans>Removed</Trans>,
    failed: <Trans>Remove</Trans>,
  };

  return (
    <BodyWrap>
      <Action {...actionProps} />{' '}
      <FormattedCurrencyAmount rawAmount={expectedAmountBaseRaw} currencyId={baseCurrencyId} sigFigs={2} />{' '}
      <Trans>and</Trans>{' '}
      <FormattedCurrencyAmount rawAmount={expectedAmountQuoteRaw} currencyId={quoteCurrencyId} sigFigs={2} />{' '}
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};

const CreateV3PoolSummary = ({
  info: { baseCurrencyId, quoteCurrencyId },
  transactionState,
}: {
  info: AddLiquidityV3PoolTransactionInfo;
  transactionState: TransactionState;
}) => {
  const baseCurrency = useCurrency(baseCurrencyId);
  const quoteCurrency = useCurrency(quoteCurrencyId);
  const actionProps = {
    transactionState,
    pending: <Trans>Creating</Trans>,
    success: <Trans>Created</Trans>,
    failed: <Trans>Create</Trans>,
  };

  return (
    <BodyWrap>
      <Action {...actionProps} />{' '}
      <HighlightText>
        {baseCurrency?.symbol}/{quoteCurrency?.symbol}{' '}
      </HighlightText>
      <Trans>Pool</Trans> <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};
const AddLiquidityV2PoolSummary = ({
  info: { quoteCurrencyId, expectedAmountBaseRaw, expectedAmountQuoteRaw, baseCurrencyId },
}: {
  info: AddLiquidityV2PoolTransactionInfo;
}) => {
  return (
    <Text color="textSubtle">
      <Trans>
        Add <FormattedCurrencyAmount rawAmount={expectedAmountBaseRaw} currencyId={baseCurrencyId} sigFigs={3} /> and{' '}
        <FormattedCurrencyAmount rawAmount={expectedAmountQuoteRaw} currencyId={quoteCurrencyId} sigFigs={3} /> to
        RoboEx
      </Trans>
    </Text>
  );
};

const ApprovalSummary = ({
  info,
  transactionState,
}: {
  info: ApproveTransactionInfo;
  transactionState: TransactionState;
}) => {
  const token = useToken(info.tokenAddress);
  const actionProps = {
    transactionState,
    pending: <Trans>Approving</Trans>,
    success: <Trans>Approved</Trans>,
    failed: <Trans>Approve</Trans>,
  };

  return (
    <BodyWrap>
      <Action {...actionProps} /> <HighlightText>{token?.symbol}</HighlightText>{' '}
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};

const ApprovalFarmSummary = ({
  info,
  transactionState,
}: {
  info: ApprovalFarmTransactionInfo;
  transactionState: TransactionState;
}) => {
  const { data } = useFarms();
  const pool = findFarmByManagerAddressAndPid(data, info.manager, info.pid);

  const actionProps = {
    transactionState,
    pending: <Trans>Approving</Trans>,
    success: <Trans>Approved</Trans>,
    failed: <Trans>Approve</Trans>,
  };

  return (
    <BodyWrap>
      <Action {...actionProps} /> <HighlightText>{pool?.lpSymbol || 'Lp Symbol'}</HighlightText>
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};
const StakingFarmSummary = ({
  info,
  transactionState,
}: {
  info: StakingFarmTransactionInfo;
  transactionState: TransactionState;
}) => {
  const { data } = useFarms();
  const pool = findFarmByManagerAddressAndPid(data, info.manager, info.pid);
  const actionProps =
    info.type === TransactionType.STAKE_FARM
      ? {
          transactionState,
          pending: <Trans>Staking</Trans>,
          success: <Trans>Staked</Trans>,
          failed: <Trans>Stake</Trans>,
        }
      : {
          transactionState,
          pending: <Trans>UnStaking</Trans>,
          success: <Trans>UnStaked</Trans>,
          failed: <Trans>UnStake</Trans>,
        };

  return (
    <BodyWrap>
      {pool && (
        <>
          <Action {...actionProps} />{' '}
          <HighlightText>
            {formatAmount(info.amount, pool?.decimals || 18, 4)} {pool?.lpSymbol || 'LP Symbol'}{' '}
          </HighlightText>{' '}
        </>
      )}{' '}
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};

const HarvetFarmSummary = ({
  info,
  transactionState,
}: {
  info: HarvestFarmTransactionInfo;
  transactionState: TransactionState;
}) => {
  const { data } = useFarms();
  const pool = findFarmByManagerAddressAndPid(data, info.manager, info.pid);

  const actionProps = {
    transactionState,
    pending: <Trans>Harvesting</Trans>,
    success: <Trans>Harvested</Trans>,
    failed: <Trans>Harvest</Trans>,
  };

  return (
    <BodyWrap>
      <Action {...actionProps} />
      <HighlightText>
        {parseNumberDisplay(new BigNumber(info?.amount), 10, pool?.decimal && pool?.decimal > 0 ? pool?.decimal : 18)} {pool?.rewardSymbol || 'LP Symbol'}
      </HighlightText>{' '}
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};

const WrapSummary = ({
  info: { chainId, currencyAmountRaw, unwrapped },
  transactionState,
}: {
  info: WrapTransactionInfo;
  transactionState: TransactionState;
}) => {
  const native = chainId ? Native.onChain(chainId) : undefined;
  const from = unwrapped ? native?.wrapped.symbol ?? 'WETH' : native?.symbol ?? 'ETH';
  const to = unwrapped ? native?.symbol ?? 'ETH' : native?.wrapped.symbol ?? 'WETH';

  const amount = formatAmount(currencyAmountRaw, 18, 6);
  const actionProps = unwrapped
    ? {
        transactionState,
        pending: <Trans>Unwrapping</Trans>,
        success: <Trans>Unwrapped</Trans>,
        failed: <Trans>Unwrap</Trans>,
      }
    : {
        transactionState,
        pending: <Trans>Wrapping</Trans>,
        success: <Trans>Wrapped</Trans>,
        failed: <Trans>Wrap</Trans>,
      };

  return (
    <BodyWrap>
      <Action {...actionProps} />{' '}
      <HighlightText>
        {amount} {from}
      </HighlightText>{' '}
      <Trans>to</Trans>{' '}
      <HighlightText>
        {amount} {to}
      </HighlightText>{' '}
      <FailedText transactionState={transactionState} />
    </BodyWrap>
  );
};

const TransactionBody = ({ info, transactionState }: { info: TransactionInfo; transactionState: TransactionState }) => {
  switch (info.type) {
    case TransactionType.SWAP:
      return <SwapSummary info={info} transactionState={transactionState} />;
    case TransactionType.ADD_LIQUIDITY_V3_POOL:
      return <AddLiquidityV3PoolSummary info={info} transactionState={transactionState} />;
    case TransactionType.REMOVE_LIQUIDITY_V3:
      return <RemoveLiquidityV3Summary info={info} transactionState={transactionState} />;

    case TransactionType.ADD_LIQUIDITY_V2_POOL:
      return <AddLiquidityV2PoolSummary info={info} />;
    case TransactionType.WRAP:
      return <WrapSummary info={info} transactionState={transactionState} />;

    case TransactionType.APPROVAL:
      return <ApprovalSummary info={info} transactionState={transactionState} />;
    case TransactionType.APPROVAL_FARM:
      return <ApprovalFarmSummary info={info} transactionState={transactionState} />;

    case TransactionType.STAKE_FARM:
    case TransactionType.UNSTAKE_FARM:
      return <StakingFarmSummary info={info} transactionState={transactionState} />;

    case TransactionType.HARVEST_FARM:
      return <HarvetFarmSummary info={info} transactionState={transactionState} />;

    default:
      return <span />;
  }
};

export default TransactionBody;
