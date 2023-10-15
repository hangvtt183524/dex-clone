import { Currency, CurrencyAmount, Percent, Token, TradeType } from 'config/sdk-core';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { InterfaceTrade } from 'state/routing/types';
import { tradeMeaningfullyDiffers } from 'utils/tradeMeaningFullyDiffer';

import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal';
import Button from 'components/Button';
import Text from 'components/Text';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Grid } from 'components/Box';
import { Trade } from 'config/router-sdk';
import IconButton from 'components/Button/IconButton';
import RoboTheme from 'styles';
import { InjectedModalProps } from 'components/Modal';
import { Column } from 'components/Layout/Column';
import SwapModalHeader from './SwapModalHeader';

const ConfirmSwapModal = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  onCallbackDismiss,
  recipient,
  swapErrorMessage,
  attemptingTxn,
  fiatValueInput,
  fiatValueOutput,
  txHash,
}: {
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined;
  originalTrade: Trade<Currency, Currency, TradeType> | undefined;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  allowedSlippage: Percent;
  onAcceptChanges: () => void;
  onConfirm: () => void;
  swapErrorMessage: ReactNode | undefined;
  onCallbackDismiss?: () => void;
  fiatValueInput?: CurrencyAmount<Token> | null;
  fiatValueOutput?: CurrencyAmount<Token> | null;
} & InjectedModalProps) => {
  const handleOnDismiss = useCallback(() => {
    if (onCallbackDismiss) onCallbackDismiss();
    onDismiss();
  }, [onCallbackDismiss, onDismiss]);

  const { t } = useTranslation();
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  );

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
        fiatValueInput={fiatValueInput}
        fiatValueOutput={fiatValueOutput}
      />
    ) : null;
  }, [allowedSlippage, fiatValueInput, fiatValueOutput, onAcceptChanges, recipient, showAcceptChanges, trade]);

  const modalBottom = useCallback(() => {
    return trade ? (
      <Column mt="16px">
        <Box height="1px" background={RoboTheme.colors.stroke} />
        <Grid mt="8px" gridTemplateColumns="repeat(2, 1fr)">
          <IconButton width="100%" height="100% !important" onClick={handleOnDismiss}>
            <Text gradient={RoboTheme.colors.gradients.primary} fontSize="16px" fontWeight={500}>
              <Trans>Cancel</Trans>
            </Text>
          </IconButton>
          <Button width="100%" scale="xl" onClick={onConfirm} disabled={showAcceptChanges}>
            <Text fontSize="16px" fontWeight={500}>
              <Trans>Confirm</Trans>
            </Text>
          </Button>
          {swapErrorMessage ? <Text>{swapErrorMessage}</Text> : null}
        </Grid>
      </Column>
    ) : null;
  }, [trade, onConfirm, showAcceptChanges, swapErrorMessage, handleOnDismiss]);

  // text to show while loading
  const pendingText = (
    <Trans>
      Swapping {trade?.inputAmount?.toExact()} {trade?.inputAmount?.currency?.symbol} for{' '}
      {trade?.outputAmount?.toExact()} {trade?.outputAmount?.currency?.symbol}
    </Trans>
  );

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={handleOnDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [handleOnDismiss, modalBottom, modalHeader, swapErrorMessage],
  );

  return (
    <TransactionConfirmationModal
      title={swapErrorMessage ? '' : t('Swap Confirmation')}
      onDismiss={handleOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={trade?.outputAmount.currency}
    />
  );
};
export default ConfirmSwapModal;
