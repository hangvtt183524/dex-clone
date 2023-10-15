import { Percent, CurrencyAmount, Currency, Token } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import ActionButton from 'components/Button/ActionButton';
import { Row } from 'components/Layout/Row';
import { SignatureData } from 'hooks/swap/useERC20Permit';
import { Trans } from 'react-i18next';
import React, { ReactNode } from 'react';
import { FieldBurn } from 'state/burn/actions';
import { ApprovalState } from 'hooks/useApproval';
import { Dots } from 'styles/common';
import Button from 'components/Button';

interface BurnActionProps {
  pair: Pair;
  parsedAmounts: {
    [FieldBurn.LIQUIDITY_PERCENT]: Percent;
    [FieldBurn.LIQUIDITY]?: CurrencyAmount<Token>;
    [FieldBurn.CURRENCY_A]?: CurrencyAmount<Currency>;
    [FieldBurn.CURRENCY_B]?: CurrencyAmount<Currency>;
  };
  signatureData: SignatureData;
  approvalState: ApprovalState;
  approveCallback: () => Promise<void>;
  handleRemove: () => void;
  error?: string | ReactNode;
}

const BurnAction: React.FC<BurnActionProps> = ({
  signatureData,
  approvalState,
  approveCallback,
  handleRemove,
  error,
}) => {
  const isValid = !error;

  const isNeedApprove = approvalState !== ApprovalState.APPROVED || signatureData !== null;

  return (
    <Row width="100%">
      {isNeedApprove && signatureData === null ? (
        <ActionButton
          variant="primary"
          width="100%"
          height="56px"
          onSubmit={approveCallback}
          onFailed={async () => {
            console.error('burn failed');
          }}
          onSucceed={async () => {
            console.debug('burn success');
          }}
          disabled={approvalState !== ApprovalState.NOT_APPROVED || signatureData !== null}
          style={{
            fontWeight: 500,
            fontSize: '16px',
          }}
        >
          {approvalState === ApprovalState.PENDING ? (
            <Dots>
              <Trans>Approving</Trans>
            </Dots>
          ) : !isNeedApprove || signatureData !== null ? (
            <Trans>Approved</Trans>
          ) : (
            <Trans>Approve</Trans>
          )}
        </ActionButton>
      ) : (
        <Button
          width="100%"
          height="56px"
          onClick={handleRemove}
          disabled={!isValid || (signatureData === null && approvalState !== ApprovalState.APPROVED)}
        >
          {error || <Trans>Remove</Trans>}
        </Button>
      )}
    </Row>
  );
};

export default BurnAction;
