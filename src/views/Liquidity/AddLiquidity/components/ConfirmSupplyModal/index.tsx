import { AutoColumn } from 'components/Layout/Column';
import { Row, RowBetween, RowFixed } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo';
import Modal, { InjectedModalProps } from 'components/Modal';
import Text from 'components/Text';
import TransactionConfirmationModal, {
    ConfirmationModalContent,
    TransactionErrorContent
} from 'components/TransactionConfirmationModal';
import { Currency, CurrencyAmount, Percent, Price, Token } from 'config/sdk-core';
import { Pair } from 'config/v2-sdk';
import { Trans } from 'react-i18next';
import React, { useCallback } from 'react';
import { FieldMint } from 'state/mint/actions';
import { PlusIcon } from 'svgs';
import ConfirmAddModalBottom from './ConfirmAddModalBottom';

export interface ModalConfirmAddLiquidityProps {
  noLiquidity: boolean;
  attemptingTxn: boolean;
  txHash: string | undefined;
  onConfirm: () => void;
  onCallbackDismiss?: () => void;
  pair: Pair;
  price?: Price<Currency, Currency>;
  parsedAmounts: { [field in FieldMint]?: CurrencyAmount<Currency> };
  liquidityMinted?: CurrencyAmount<Token>;
  currencies: { [field in FieldMint]?: Currency };
  allowedSlippage: Percent;
  poolTokenPercentage?: Percent;
}

export interface ModalErrorAddLiquidityProps {
    message: string;
}

const ConfirmSupplyModal: React.FC<InjectedModalProps & ModalConfirmAddLiquidityProps> = ({
  onConfirm,
  noLiquidity,
  attemptingTxn,
  txHash,
  pair,
  price,
  parsedAmounts,
  liquidityMinted,
  currencies,
  allowedSlippage,
  poolTokenPercentage,
  onDismiss,
  onCallbackDismiss,
}) => {
  const handleOnDismiss = useCallback(() => {
    if (onCallbackDismiss) onCallbackDismiss();
    onDismiss();
  }, [onCallbackDismiss, onDismiss]);

  const modalHeader = useCallback(
    () =>
      noLiquidity ? (
        <AutoColumn gap="8px">
          <RowBetween>
            <Text fontSize="20px">{parsedAmounts[FieldMint.INPUT]?.toSignificant(6)}</Text>
            <RowFixed>
              <CurrencyLogo currency={currencies[FieldMint.INPUT]} />
              <Text fontSize="20px" ml="8px">
                <Trans>{currencies[FieldMint.INPUT]?.symbol}</Trans>
              </Text>
            </RowFixed>
          </RowBetween>

          <PlusIcon />

          <RowBetween>
            <Text fontSize="20px">{parsedAmounts[FieldMint.OUTPUT]?.toSignificant(6)}</Text>
            <RowFixed>
              <CurrencyLogo currency={currencies[FieldMint.OUTPUT]} />
              <Text fontSize="20px" ml="8px">
                <Trans>{currencies[FieldMint.OUTPUT]?.symbol}</Trans>
              </Text>
            </RowFixed>
          </RowBetween>
        </AutoColumn>
      ) : (
        <AutoColumn gap="12px">
          <RowFixed>
            <Text fontSize="32px" fontWeight={500} lineHeight="32px" marginRight={10}>
              {liquidityMinted?.toSignificant(6)}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[FieldMint.INPUT]}
              currency1={currencies[FieldMint.OUTPUT]}
              size={28}
            />
          </RowFixed>
          <Row>
            <Text fontSize="18px" lineHeight="28px" fontWeight={400}>
              {`${currencies[FieldMint.INPUT]?.symbol}-${currencies[FieldMint.OUTPUT]?.symbol} Pool Tokens`}
            </Text>
          </Row>
          <Text
            fontSize="12px"
            lineHeight="18px"
            color="textSubtle"
            style={{
              fontStyle: 'italic',
            }}
          >
            <Trans>
              Output is estimated. If the price changes by more than {allowedSlippage.toSignificant(4)}% your
              transaction will revert.
            </Trans>
          </Text>
        </AutoColumn>
      ),
    [allowedSlippage, currencies, liquidityMinted, noLiquidity, parsedAmounts],
  );

  const modalBottom = useCallback(() => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onConfirm}
        poolTokenPercentage={poolTokenPercentage}
        onDismiss={handleOnDismiss}
      />
    );
  }, [currencies, noLiquidity, onConfirm, handleOnDismiss, parsedAmounts, poolTokenPercentage, price]);

  const pendingText = (
    <Trans>
      Supplying {parsedAmounts[FieldMint.INPUT]?.toSignificant(6)} {currencies[FieldMint.INPUT]?.symbol} and{' '}
      {parsedAmounts[FieldMint.OUTPUT]?.toSignificant(6)} {currencies[FieldMint.OUTPUT]?.symbol}
    </Trans>
  );

  const confirmationContent = useCallback(
    () => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />,
    [modalBottom, modalHeader],
  );

  return (
    <TransactionConfirmationModal
      title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
      onDismiss={handleOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
    />
  );
};

export const SupplyLiquidityErrorModal: React.FC<InjectedModalProps & ModalErrorAddLiquidityProps> = ({ onDismiss = () => null, message }) => {
    return (
        <Modal
            title=''
            maxWidth="450px !important"
            maxHeight={90}
        >
            <TransactionErrorContent onDismiss={onDismiss} message={message} />
        </Modal>
    )
};

export default ConfirmSupplyModal;
