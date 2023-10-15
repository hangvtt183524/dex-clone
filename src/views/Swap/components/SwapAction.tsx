import Button from 'components/Button';
import ActionButton from 'components/Button/ActionButton';
import ConnectButton from 'components/ConnectButton';
import { Row } from 'components/Layout/Row';
import Text from 'components/Text';
import { Currency, CurrencyAmount, Percent, TradeType } from 'config/sdk-core';
import { ApprovalState } from 'hooks/useApproval';
import { useApproveCallbackFromTrade } from 'hooks/useApproveCallback';
import { useIsSwapUnsupported } from 'hooks/useIsSwapUnsupported';
import JSBI from 'jsbi';
import { useAccount } from 'packages/wagmi/src';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { InterfaceTrade, TradeState } from 'state/routing/types';
import { Field } from 'state/swap/actions';
import styled from 'styled-components';
import { Dots } from 'styles/common';
import { WrapErrorText, WrapInputError, WrapType } from 'utils/useWrapCallback';

const SwapAction: React.FC<{
  error?: string | ReactNode;
  disabled?: boolean;
  currencies: {
    [field in Field]?: Currency;
  };
  typedValue?: string;
  parsedAmounts?: {
    [field in Field]?: CurrencyAmount<Currency>;
  };
  independentField?: Field;

  trade: InterfaceTrade<Currency, Currency, TradeType>;
  tradeState: TradeState;
  allowedSlippage?: Percent;
  onSubmit: () => Promise<any>;

  isUniswap?: boolean;

  // price impact
  priceImpactSeverity?: number;
  priceImpactTooHigh?: boolean;

  // wrap
  showWrap: boolean;
  wrapType: WrapType;
  onWrap: () => Promise<void>;
  wrapInputError: WrapInputError;
}> = ({
  error,
  disabled,
  currencies,
  parsedAmounts,
  independentField,

  trade,
  tradeState,
  allowedSlippage,
  onSubmit,

  // price impact
  priceImpactSeverity,
  priceImpactTooHigh,

  isUniswap,

  // wrap
  showWrap,
  wrapType,
  onWrap,
  wrapInputError,
}) => {
  const { isConnected } = useAccount();

  // unSupported
  const swapIsUnsupported = useIsSwapUnsupported(currencies[Field.INPUT], currencies[Field.OUTPUT]);

  // route not found
  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [!trade?.swaps, TradeState.LOADING === tradeState, TradeState.SYNCING === tradeState],
    [trade, tradeState],
  );

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  );

  const [approvalPending, setApprovalPending] = useState<boolean>(false);
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade as unknown as any, allowedSlippage, {
    isUniswap,
  });
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(approvalState === ApprovalState.APPROVED);

  const isApprovePending = approvalPending || approvalState === ApprovalState.PENDING;
  const showApproveFlow =
    !error &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      isApprovePending ||
      (approvalSubmitted && approvalState !== ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3);

  const approveTokenButtonDisabled = approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted;

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState, approvalSubmitted]);
  const handleApprove = useCallback(async () => {
    setApprovalPending(true);
    try {
      await approveCallback().then(() => {
        setApprovalPending(false);
      });
    } catch {
      setApprovalPending(false);
    }
  }, [approveCallback]);

  return (
    <Row width="100%">
      {!isConnected ? (
        <ConnectButton width="100%" scale="xl" height={['50px', '55px']} />
      ) : swapIsUnsupported ? (
        <Button height={['50px', '55px']} width="100%" variant="primary" disabled>
          <Text mb="4px">
            <Trans>Unsupported Asset</Trans>
          </Text>
        </Button>
      ) : showApproveFlow ? (
        <StyledActionButton
          onSubmit={handleApprove}
          onSucceed={(e) => {
            console.debug('approve-success', e);
          }}
          onFailed={(e) => {
            console.error('approve-failed', e);
          }}
          disabled={approveTokenButtonDisabled || isApprovePending}
          width="100%"
          height={['50px', '55px']}
          variant="primary"
        >
          {isApprovePending ? <Dots>Approving</Dots> : <Trans>Approve {currencies[Field.INPUT]?.symbol}</Trans>}
        </StyledActionButton>
      ) : showWrap ? (
        <StyledActionButton
          onSucceed={(e) => {
            console.debug('wrap-success', e);
          }}
          onFailed={(e) => {
            console.error('wrap-failed', e);
          }}
          variant="primary"
          disabled={Boolean(wrapInputError)}
          onSubmit={onWrap}
          height={['50px', '55px']}
        >
          {wrapInputError ? (
            <WrapErrorText wrapInputError={wrapInputError} />
          ) : wrapType === WrapType.WRAP ? (
            <Trans>Wrap</Trans>
          ) : wrapType === WrapType.UNWRAP ? (
            <Trans>Unwrap</Trans>
          ) : null}
        </StyledActionButton>
      ) : routeNotFound && userHasSpecifiedInputOutput && !routeIsLoading && !routeIsSyncing ? (
        <Button scale="xl" radius="medium" width="100%" height={['50px', '55px']} variant="primary" disabled>
          <Trans>Insufficient liquidity for this trade.</Trans>
        </Button>
      ) : isConnected ? (
        <StyledActionButton
          onSubmit={onSubmit}
          onSucceed={() => {
            console.debug('success');
          }}
          onFailed={() => {
            console.error('failed');
          }}
          variant={error ? 'disabled' : 'primary'}
          disabled={routeIsSyncing || routeIsLoading || priceImpactTooHigh || !!error || disabled}
          scale="xl"
          height={['50px', '55px']}
          radius="medium"
        >
          {error ||
            (routeIsSyncing || routeIsLoading ? (
              <Trans>Swap</Trans>
            ) : priceImpactTooHigh ? (
              <Trans>Price Impact Too High</Trans>
            ) : (
              <Trans>Swap</Trans>
            ))}
        </StyledActionButton>
      ) : (
        <></>
      )}
    </Row>
  );
};

const StyledActionButton = styled(ActionButton)`
  width: 100%;
  height: 50px;
  font-weight: 600;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 56px;
  }
`;

export default SwapAction;
