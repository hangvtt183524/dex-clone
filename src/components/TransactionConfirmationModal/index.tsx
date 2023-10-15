import { Currency } from 'config/sdk-core';
import Button from 'components/Button';
import { AutoColumn, ColumnCenter } from 'components/Layout/Column';
import { RowCenter } from 'components/Layout/Row';
import LinkExternal from 'components/Link/LinkExternal';
import Modal from 'components/Modal';
import Text from 'components/Text';
import { TransactionSummary } from 'components/TransactionModal/TransactionSummary';
import { SupportedL2ChainId } from 'config/constants/chains';
import { isL2ChainId } from 'config/networks';
import { Trans, useTranslation } from 'react-i18next';
import React, { ReactNode, useState, useCallback } from 'react';
import { useIsTransactionConfirmed, useTransaction } from 'state/transactions/hooks';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { WarningInfoIcon } from 'svgs';
import { getExploreName, getExplorerLink } from 'utils/getExplorer';
import { getNativeLogoURI, getTokenLogoURI } from 'utils/getTokenLogo';
import Loading from 'components/Icon/Loading';
import CircleLoader from 'components/Loader/CircleLoader';
import { registerToken } from 'utils/wallet';
import Link from 'components/Link';
import Image from 'components/Image';
import { useImportToken } from 'state/user/hooks';
import { get } from 'lodash';
import { NATIVE_TOKEN } from 'config/tokens';
import { useAccount } from 'packages/wagmi/src';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import AnimatedConfirmation from './AnimatedConfirmation';
import { ConfirmationModalProps } from './types';

const Wrapper = styled.div`
  width: 100%;
  .success-icon {
    transform: scale(0.5);
  }
  .triangle-error {
    path {
      stroke: ${({ theme }) => theme.colors.failure};
    }
  }
`;
const Section = styled(AutoColumn)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '0' : '0')};
`;

const BottomSection = styled(Section)`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding-bottom: 10px;
`;

const ConfirmedIcon = styled(ColumnCenter)<{ inline?: boolean }>`
  padding: ${({ inline }) => (inline ? '20px 0' : '32px 0;')};
`;

const StyledWrapAddIcon = styled(RowCenter)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`;

const ConfirmationPendingContent = ({ pendingText }: { pendingText: ReactNode }) => {
  return (
    <Wrapper>
      <AutoColumn gap="md">
        <RowCenter mb="24px">
          <CircleLoader />
        </RowCenter>
        <AutoColumn gap="12px" justify="center">
          <Text fontWeight={500} fontSize="20px" textAlign="center">
            <Trans>Waiting for confirmation</Trans>
          </Text>
          <Text fontWeight={600} fontSize="16px" textAlign="center">
            {pendingText}
          </Text>
          <Text fontWeight={400} fontSize="12px" color="textSubtle" textAlign="center" marginBottom="12px">
            <Trans>Confirm this transaction in your wallet</Trans>
          </Text>
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  );
};
const TransactionSubmittedContent = ({
  chainId,
  hash,
  currencyToAdd,
  onDismiss,
}: {
  hash: string | undefined;
  chainId: number;
  currencyToAdd?: Currency | undefined;
  inline?: boolean; // not in modal
  onDismiss: () => void;
}) => {
  const isNative = currencyToAdd?.isNative || currencyToAdd?.symbol === NATIVE_TOKEN?.[chainId]?.symbol;
  const { t } = useTranslation();
  const token = isNative ? null : currencyToAdd?.wrapped;
  const [importSuccess, setSuccess] = useState<boolean | undefined>();
  const [stateImportToken, importToken] = useImportToken();
  const { address } = useAccount();

  const addToken = useCallback(() => {
    if (!token?.symbol) return;
    registerToken({
      address: token.address,
      symbol: currencyToAdd.symbol,
      decimals: currencyToAdd.decimals,
      logo: currencyToAdd.isNative
        ? getNativeLogoURI(currencyToAdd.chainId)
        : getTokenLogoURI(token.address, token.chainId),
    })
      .then(() => {
        setSuccess(true);
        importToken(token.address, address, chainId);
      })
      .catch(() => setSuccess(false));
  }, [address, chainId, currencyToAdd, importToken, token]);

  const isImportedToken =
    (token?.address && get(stateImportToken, `[${chainId}][${address}][${token.address}]`, false)) || isNative;
  const isImportedSuccess = isImportedToken && importSuccess && currencyToAdd;

  return (
    <Wrapper>
      <RowCenter>
        <StyledWrapAddIcon>
          <Image
            src={`/assets/images/${isImportedSuccess ? 'succeed' : 'submitted'}.png`}
            width={70}
            height={70}
            alt="image-submmitted"
          />
        </StyledWrapAddIcon>
      </RowCenter>
      <AutoColumn gap="12px" justify="center">
        <Text fontSize="20px" textAlign="center" my="16px">
          {isImportedSuccess ? <Trans>Imported Successfully</Trans> : <Trans>Transaction submitted</Trans>}
        </Text>

        {chainId && hash && (
          <Link target="_blank" my="12px" href={getExplorerLink(hash, 'transaction', chainId)}>
            <Text fontWeight={700} fontSize="14px" gradient={RoboTheme.colors.gradients.primary}>
              {t('View on {{site}}', {
                site: getExploreName(chainId),
              })}
            </Text>
          </Link>
        )}
        <Button
          padding="16px"
          height="48px"
          width="100%"
          onClick={!isImportedToken && !importSuccess && token ? addToken : onDismiss}
        >
          <Text fontWeight={600}>
            {isImportedToken && importSuccess && token ? (
              <Trans>Done </Trans>
            ) : token && !isImportedToken && !importSuccess ? (
              <Trans>Import {currencyToAdd.symbol} to your Wallet</Trans>
            ) : (
              <Trans>Close</Trans>
            )}
          </Text>
        </Button>
      </AutoColumn>
    </Wrapper>
  );
};

export const ConfirmationModalContent = ({
  bottomContent,
  topContent,
}: {
  topContent: () => ReactNode;
  bottomContent?: () => ReactNode | undefined;
}) => {
  return (
    <Wrapper>
      <Section>{topContent()}</Section>
      {bottomContent && <BottomSection gap="16px">{bottomContent()}</BottomSection>}
    </Wrapper>
  );
};

export const TransactionErrorContent = ({ message, onDismiss }: { message: ReactNode; onDismiss: () => void }) => {
  return (
    <Wrapper>
      <Section>
        <AutoColumn pb="24px" gap="24px" justify="center">
          <Image
            src="/assets/images/failure-action.png"
            height={80}
            width={80}
            className="triangle-error"
            alt="failure-action"
          />
          <Text fontSize="18px">Unexpected Issues!</Text>
          <Text color="textSubtle" textAlign="center">
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <Button variant="primary" onClick={onDismiss}>
          <Trans>Dismiss</Trans>
        </Button>
      </BottomSection>
    </Wrapper>
  );
};

const L2Content = ({
  onDismiss,
  chainId,
  hash,
  pendingText,
  inline,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: SupportedL2ChainId;
  currencyToAdd?: Currency | undefined;
  pendingText: ReactNode;
  inline?: boolean; // not in modal
}) => {
  const transaction = useTransaction(hash);
  const confirmed = useIsTransactionConfirmed(hash);
  const transactionSuccess = transaction?.receipt?.status === 1;
  const { t } = useTranslation();

  // convert unix time difference to seconds
  const secondsToConfirm = transaction?.confirmedTime
    ? (transaction.confirmedTime - transaction.addedTime) / 1000
    : undefined;

  return (
    <Wrapper>
      <Section inline={inline}>
        <ConfirmedIcon inline={inline}>
          {confirmed ? transactionSuccess ? <AnimatedConfirmation /> : <WarningInfoIcon /> : <Loading color="#FFF" />}
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <Text fontWeight={500} fontSize="20px" textAlign="center">
            {!hash ? (
              <Trans>Confirm transaction in wallet</Trans>
            ) : !confirmed ? (
              <Trans>Transaction Submitted</Trans>
            ) : transactionSuccess ? (
              <Trans>Success</Trans>
            ) : (
              <Trans>Error</Trans>
            )}
          </Text>
          <Text fontWeight={400} fontSize="16px" textAlign="center">
            {transaction ? <TransactionSummary info={transaction.info} /> : pendingText}
          </Text>
          {chainId && hash ? (
            <LinkExternal href={getExplorerLink(hash, 'transaction', chainId)}>
              <Text fontWeight={500} fontSize="14px" color="warning">
                {t('View on {{site}}', {
                  site: getExploreName(chainId),
                })}
              </Text>
            </LinkExternal>
          ) : (
            <div style={{ height: '17px' }} />
          )}
          <Text color="textSubtle" style={{ margin: '20px 0 0 0' }} fontSize="14px">
            {!secondsToConfirm ? (
              <div style={{ height: '24px' }} />
            ) : (
              <div>
                <Trans>Transaction completed in </Trans>
                <span
                  style={{
                    fontWeight: 500,
                    marginLeft: '4px',
                    color: 'textSubtle',
                  }}
                >
                  {secondsToConfirm} seconds 🎉
                </span>
              </div>
            )}
          </Text>
          <Button onClick={onDismiss} style={{ margin: '4px 0 0 0' }}>
            <Text fontWeight={500} fontSize="20px">
              {inline ? <Trans>Return</Trans> : <Trans>Close</Trans>}
            </Text>
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
};

const TransactionConfirmationModal = ({
  onDismiss,
  attemptingTxn,
  hash,
  title,
  pendingText,
  content,
  currencyToAdd,
}: ConfirmationModalProps) => {
  const { chainId } = useActiveWeb3React();

  return (
    <Modal
      title={attemptingTxn || hash ? '' : title}
      onDismiss={onDismiss}
      maxHeight={90}
      width="100%"
      maxWidth="450px !important"
    >
      {isL2ChainId(chainId) && (hash || attemptingTxn) ? (
        <L2Content chainId={chainId} hash={hash} onDismiss={onDismiss} pendingText={pendingText} />
      ) : attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          onDismiss={onDismiss}
          chainId={chainId}
          hash={hash}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  );
};
export default TransactionConfirmationModal;
