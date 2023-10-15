import ActionButton from 'components/Button/ActionButton';
import ConnectButton from 'components/ConnectButton';
import { Row, RowBetween } from 'components/Layout/Row';
import { Currency, CurrencyAmount } from 'config/sdk-core';
import { useApproveCallback } from 'hooks/useApproveCallback';
import React, { ReactNode } from 'react';
import { FieldMint } from 'state/mint/actions';
import { ApprovalState } from 'hooks/useApproval';
import styled from 'styled-components';
import { Dots } from 'styles/common';
import { useAccount } from 'packages/wagmi/src';

const MintAction: React.FC<{
  parsedAmounts: {
    [key in FieldMint]?: CurrencyAmount<Currency>;
  };
  currencies: {
    [key in FieldMint]?: Currency;
  };
  error?: string | ReactNode;
  onSubmit: () => Promise<any>;
  routerAddress: string;
}> = ({ error, onSubmit, parsedAmounts, routerAddress, currencies }) => {
  const { isConnected } = useAccount();

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[FieldMint.INPUT], routerAddress);
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[FieldMint.OUTPUT], routerAddress);

  const isApproving = approvalA === ApprovalState.PENDING || approvalB === ApprovalState.PENDING;
  const isHaveToApprove =
    (approvalA === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.NOT_APPROVED || isApproving) && !error;

  return (
    <Row width="100%">
      {isHaveToApprove ? (
        <RowBetween>
          {approvalA !== ApprovalState.APPROVED && (
            <CustomActionButton
              variant="primary"
              onSubmit={approveACallback}
              onSucceed={(e) => {
                console.debug('approve-a-success', e);
              }}
              onFailed={(e) => {
                console.error('approve-a-failed', e);
              }}
              disabled={approvalA === ApprovalState.PENDING}
              width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
            >
              {isApproving ? (
                <Dots>
                  <>Approving {currencies[FieldMint.INPUT]?.symbol}</>
                </Dots>
              ) : (
                <>Approve {currencies[FieldMint.INPUT]?.symbol}</>
              )}
            </CustomActionButton>
          )}
          {approvalB !== ApprovalState.APPROVED && (
            <CustomActionButton
              variant="primary"
              onSubmit={approveBCallback}
              onSucceed={(e) => {
                console.debug('approve-b-success', e);
              }}
              onFailed={(e) => {
                console.error('approve-b-failed', e);
              }}
              disabled={approvalB === ApprovalState.PENDING}
              width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
            >
              {approvalB === ApprovalState.PENDING ? (
                <Dots>
                  <>Approving {currencies[FieldMint.OUTPUT]?.symbol}</>
                </Dots>
              ) : (
                <>Approve {currencies[FieldMint.OUTPUT]?.symbol}</>
              )}
            </CustomActionButton>
          )}
        </RowBetween>
      ) : isConnected ? (
        <CustomActionButton
          onSubmit={onSubmit}
          onSucceed={(e) => {
            console.debug('supply-success', e);
          }}
          onFailed={(e) => {
            console.error('supply-failed', e);
          }}
          variant={error ? 'disabled' : 'primary'}
          disabled={!!error}
          width="100%"
        >
          {error || 'Supply'}
        </CustomActionButton>
      ) : (
        <ConnectButton width="100%" scale="xl" height={['50px', '50px', '50px', '56px']} />
      )}
    </Row>
  );
};

const CustomActionButton = styled(ActionButton).attrs({
  scale: 'xl',
  radius: 'medium',
  height: ['50px', '50px', '50px', '56px'],
})`
  font-weight: 600;
`;

export default MintAction;
