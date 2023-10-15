import { Box, Grid } from 'components/Box';
import Button from 'components/Button';
import IconButton from 'components/Button/IconButton';
import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowCenter, RowFixed } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import { InjectedModalProps } from 'components/Modal';
import Text from 'components/Text';
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal';
import { Currency, CurrencyAmount, Percent, Token } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { SignatureData } from 'hooks/swap/useERC20Permit';
import { Trans, useTranslation } from 'react-i18next';
import React, { useCallback, useMemo } from 'react';
import { FieldBurn } from 'state/burn/actions';
import { ApprovalState } from 'hooks/useApproval';
import RoboTheme from 'styles';
import { PlusIcon } from 'svgs';
import { formatTransactionAmount, priceToPreciseFloat } from 'utils/numbersHelper';

interface ModalConfirmRemoveLiquidityProps {
  pair: Pair;
  currencyA: Currency;
  currencyB: Currency;
  allowedSlippage: Percent;
  attemptingTxn: boolean;
  txHash: string;
  approval: ApprovalState;
  signatureData: SignatureData;
  parsedAmounts: {
    [FieldBurn.LIQUIDITY_PERCENT]: Percent;
    [FieldBurn.LIQUIDITY]?: CurrencyAmount<Token>;
    [FieldBurn.CURRENCY_A]?: CurrencyAmount<Currency>;
    [FieldBurn.CURRENCY_B]?: CurrencyAmount<Currency>;
  };
  callBackDismiss?: () => void;
  handleRemove: () => void;
}
const ModalConfirmRemoveLiquidity: React.FC<ModalConfirmRemoveLiquidityProps & InjectedModalProps> = ({
  pair,
  approval,
  signatureData,
  parsedAmounts,
  allowedSlippage,
  attemptingTxn,
  txHash,
  currencyA,
  currencyB,
  handleRemove,
  onDismiss,
  callBackDismiss,
}) => {
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB]);
  const { t } = useTranslation();
  const handleDismissConfirmation = useCallback(() => {
    onDismiss();
    if (callBackDismiss) {
      callBackDismiss();
    }
  }, [callBackDismiss, onDismiss]);
  const modalHeader = useCallback(() => {
    return (
      <AutoColumn
        gap="md"
        width="100%"
        style={{
          overflow: 'hidden',
        }}
      >
        <RowBetween alignItems="flex-end">
          <Text fontSize="20px" fontWeight={500}>
            {parsedAmounts[FieldBurn.CURRENCY_A]?.toExact()?.length > 21 ? `${parsedAmounts[FieldBurn.CURRENCY_A]?.toExact().substring(0, 21)}...` : parsedAmounts[FieldBurn.CURRENCY_A]?.toExact()}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyA} size={28} />
            <Text fontSize="20px" fontWeight={500} ml="10px">
              {currencyA?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <PlusIcon />
        </RowFixed>
        <RowBetween alignItems="flex-end">
          <Text fontSize="20px" fontWeight={500}>
            {parsedAmounts[FieldBurn.CURRENCY_B]?.toExact()?.length > 21 ? `${parsedAmounts[FieldBurn.CURRENCY_B]?.toExact().substring(0, 21)}...` : parsedAmounts[FieldBurn.CURRENCY_B]?.toExact()}
          </Text>
          <RowFixed gap="4px">
            <CurrencyLogo currency={currencyB} size={28} />
            <Text fontSize="20px" fontWeight={500} ml="10px">
              {currencyB?.symbol}
            </Text>
          </RowFixed>
        </RowBetween>

        <Text fontSize="12px" color="textSubtle" fontStyle="italic" textAlign="left" mt="14px">
          <Trans>
            Output is estimated. If the price changes by more than {allowedSlippage.toSignificant(4)}% your transaction
            will revert.
          </Trans>
        </Text>
      </AutoColumn>
    );
  }, [allowedSlippage, currencyA, currencyB, parsedAmounts]);

  const modalBottom = useCallback(() => {
    return (
      <AutoColumn gap="8px">
        <Box background="#2D3748" height="1px" my="24px" />
        <RowBetween>
          <Text color="textSubtle" fontWeight={400} fontSize="14px">
            <Trans>
              {currencyA?.symbol}-{currencyB?.symbol} Burned
            </Trans>
          </Text>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} size={24} />
            <Text fontWeight={500} fontSize="14px">
              {parsedAmounts[FieldBurn.LIQUIDITY]?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        {pair && (
          <>
            <RowBetween>
              <Text color="textSubtle" fontWeight={400} fontSize="14px">
                <Trans>Price</Trans>
              </Text>
              <Text fontWeight={500} fontSize="14px">
                1 {currencyA?.symbol} = {tokenA ? formatTransactionAmount(priceToPreciseFloat(pair.priceOf(tokenA))): '-'} {currencyB?.symbol}
              </Text>
            </RowBetween>
            <RowBetween>
              <div />
              <Text fontWeight={500} fontSize="14px">
                1 {currencyB?.symbol} = {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </RowBetween>
          </>
        )}
        <Box background="#2D3748" height="1px" mt="24px" mb="12px" />

        <Grid gridTemplateColumns="repeat(2, auto)">
          <IconButton height="100% !important" scale="lg" onClick={onDismiss}>
            <RowCenter height="100%">
              <Text fontWeight={600} fontSize="16px" gradient={RoboTheme.colors.gradients.primary}>
                <Trans>Cancel</Trans>
              </Text>
            </RowCenter>
          </IconButton>
          <Button
            disabled={!(approval === ApprovalState.APPROVED || signatureData !== null)}
            scale="lg"
            onClick={handleRemove}
          >
            <Text fontWeight={600} fontSize="16px">
              <Trans>Confirm</Trans>
            </Text>
          </Button>
        </Grid>
      </AutoColumn>
    );
  }, [approval, currencyA, currencyB, handleRemove, onDismiss, pair, parsedAmounts, signatureData, tokenA, tokenB]);

  const pendingText = (
    <Trans>
      Removing {parsedAmounts[FieldBurn.CURRENCY_A]?.toSignificant(6)} {currencyA?.symbol} and{' '}
      {parsedAmounts[FieldBurn.CURRENCY_B]?.toSignificant(6)} {currencyB?.symbol}
    </Trans>
  );

  const handleRenderContent = useCallback(
    () => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />,
    [modalBottom, modalHeader],
  );

  return (
    <TransactionConfirmationModal
      title={t('You will receive')}
      onDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash || ''}
      content={handleRenderContent}
      pendingText={pendingText}
    />
  );
};

export default ModalConfirmRemoveLiquidity;
