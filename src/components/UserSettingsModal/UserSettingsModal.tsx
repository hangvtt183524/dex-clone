import { Box } from 'components/Box';
import ButtonGroup from 'components/ButtonGroup/ButtonGroup';
import ButtonItemGroup from 'components/ButtonGroup/ButtonItemGroup';
import Input from 'components/Input';
import { AutoColumn } from 'components/Layout/Column';
import { RowBetween, RowFixed, RowMiddle } from 'components/Layout/Row';
import Modal from 'components/Modal';
import QuestionHelper from 'components/QuestionHelper';
import Text from 'components/Text';
import Toggle from 'components/Toggle';
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE, MAXIMUN_ALLOW_SLIPPAGE } from 'config/constants';
import { explainField } from 'config/explain';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers';
import {
  useClientSideRouter,
  useExpertModeManager,
  useUserExpertModeAcknowledgementShow,
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from 'state/user/hooks';
import styled from 'styled-components';
import { formatDeadlineTime, formatDisplayDeadlineTime } from 'utils/dateHelper';
import { formatDisplaySlipageNumber, formatSlipageNumber } from 'utils/numbersHelper';
import { checkNumberInput, escapeRegExp } from 'utils/regExpHelpers';
import ExpertModal from './ExpertModal';
import { ModalAccountSettingsProps } from './types';

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

const DefaultSlippage = [500, 1000, 1500];

// const defaultGas = [
//   {
//     title: 'Slow',
//     gasPrice: GAS_PRICE_GWEI.default,
//   },
//   {
//     title: 'Average',
//     gasPrice: GAS_PRICE_GWEI.average,
//   },
//   {
//     title: 'Fast',
//     gasPrice: GAS_PRICE_GWEI.fast,
//   },
// ];

const UserSettingsModal: React.FC<ModalAccountSettingsProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false);
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow();
  const { onChangeRecipient } = useSwapActionHandlers();
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance();
  const [userDeadline, setUserDeadline] = useUserTransactionTTL();
  const [userDeadlineDisplay, setUserDeadLineDisplay] = useState(userDeadline);
  // const [gasPrice, setGasPrice, ethGasPrice] = useGasPriceManager();
  // const priceGwei = ethGasPrice ? JSBI.divide(ethGasPrice, JSBI.BigInt(10e8)) : undefined;

  const slippageIsInConfig = DefaultSlippage.includes(userSlippageTolerance);

  const [slippageInput, setSlippageInput] = useState(
    slippageIsInConfig ? '' : formatDisplaySlipageNumber(userSlippageTolerance),
  );
  const [expertMode, toggleExpertMode] = useExpertModeManager();
  const [clientSideRouter, setClientSideRouter] = useClientSideRouter();

  const { t } = useTranslation();

  const slippageInputIsValid =
    slippageInput === '' ||
    formatDisplaySlipageNumber(userSlippageTolerance).toFixed(2) ===
      Number.parseFloat(slippageInput.toString()).toFixed(2);

  let slippageError: SlippageError | undefined;
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput;
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow;
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh;
  } else {
    slippageError = undefined;
  }

  const handleChangeSlippage = useCallback(
    (percent: number) => {
      const slippageFormat = Number.parseInt(percent.toString());
      if (!Number.isNaN(slippageFormat) && slippageFormat < MAXIMUN_ALLOW_SLIPPAGE) {
        setUserSlippageTolerance(slippageFormat);
      }
    },
    [setUserSlippageTolerance],
  );

  const onChangeInputSlippage = useCallback(
    (e: any) => {
      const value = e?.target?.value.replace(/,/, '.').toString();
      if (value === '' || checkNumberInput(escapeRegExp(value))) {
        setSlippageInput(value);
        const percent = formatSlipageNumber(e?.target?.value.toString()) || INITIAL_ALLOWED_SLIPPAGE;
        handleChangeSlippage(percent);
      }
    },
    [handleChangeSlippage],
  );

  const onChangeInputDeadline = useCallback(
    (e: any) => {
      const deadline = formatDeadlineTime(e?.target?.value.toString().substring(0, 3));
      if (!Number.isNaN(deadline)) {
        setUserDeadLineDisplay(deadline);
        setUserDeadline(deadline > 0 ? deadline : DEFAULT_DEADLINE_FROM_NOW);
      } else {
        setUserDeadLineDisplay(undefined);
        setUserDeadline(DEFAULT_DEADLINE_FROM_NOW);
      }
    },
    [setUserDeadline],
  );

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    );
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null);
      toggleExpertMode();
    } else if (!showExpertModeAcknowledgement) {
      onChangeRecipient(null);
      toggleExpertMode();
    } else {
      setShowConfirmExpertModal(true);
    }
  };
  const handleClientSideRouter = () => {
    setClientSideRouter(!clientSideRouter);
  };

  return (
    <Modal title="Settings" onDismiss={onDismiss} maxWidth={['100%', '500px']}>
      <AutoColumn gap="28px">
        <Box>
          <RowMiddle mb={['10px', '20px']}>
            <TitleField>Slippage Tolerance</TitleField>
            <QuestionHelper text={explainField.slippageTolarence} placement="auto" />
          </RowMiddle>
          <RowFixed>
            <ButtonGroup gridGap="14px">
              {DefaultSlippage.map((percent) => {
                const isActive = percent === userSlippageTolerance;

                return (
                  <ButtonItemGroup
                    p="8px"
                    height="40px"
                    minWidth="40px"
                    active={isActive}
                    key={`group-percent-item-${percent}`}
                    onClick={() => {
                      handleChangeSlippage(percent);
                      setSlippageInput(formatDisplaySlipageNumber(percent));
                    }}
                    background={
                      !isActive
                        ? 'linear-gradient(0deg, rgba(230, 230, 230, 0.15), rgba(230, 230, 230, 0.15)), #080E17 !important'
                        : ''
                    }
                  >
                    <Text scale="sm">{formatDisplaySlipageNumber(percent)}%</Text>
                  </ButtonItemGroup>
                );
              })}
            </ButtonGroup>
            <Box flex={1} ml="14px" position="relative">
              <Input
                value={slippageInput ? slippageInput?.toString() : ''}
                onChange={onChangeInputSlippage}
                onBlur={() => handleChangeSlippage(userSlippageTolerance)}
                placeholder={formatDisplaySlipageNumber(userSlippageTolerance).toString()}
                style={{
                  border: '1px solid #FFF',
                  background: 'rgba(255,255,255,0.04)',
                }}
                variant="quaternary"
              />
              {!!slippageError && (
                <StyledTextError $error={slippageError === SlippageError.InvalidInput}>
                  {slippageError === SlippageError.InvalidInput
                    ? t('Enter a valid slippage percentage')
                    : slippageError === SlippageError.RiskyLow
                    ? t('Your transaction may fail')
                    : t('Your transaction may be frontrun')}
                </StyledTextError>
              )}
            </Box>
          </RowFixed>
        </Box>

        {/* <Box>
          <RowMiddle mb={['10px', '20px']}>
            <TitleField>Estimate Gas Fee</TitleField>
            <QuestionHelper text={explainField.slippageTolarence} />
          </RowMiddle>
          <AutoColumn>
            {defaultGas.map((gas) => (
              <StyledItemGas
                key={`group-gas-item-${gas.title}`}
                active={gasPrice?.toString() === gas.gasPrice.toString()}
                onClick={() => {
                  setGasPrice(gas.gasPrice.toString());
                }}
              >
                <Text fontWeight={500} fontSize="14px">
                  {gas.title}
                </Text>
                <Text fontWeight={500} fontSize="14px">
                  {gasPrice && ethGasPrice ? priceGwei.toString() : 1} Gwei ~ $0.22
                </Text>
              </StyledItemGas>
            ))}
          </AutoColumn>
        </Box> */}

        <RowBetween>
          <RowMiddle>
            <TitleField>Deadline (mins)</TitleField>
            <QuestionHelper text={explainField.transactionDeadline} maxWidth="250px !important" placement="auto" />
          </RowMiddle>
          <Input
            style={{
              border: '1px solid #FFF',
              background: 'rgba(255,255,255,0.04)',
            }}
            variant="quaternary"
            maxWidth="90px"
            value={userDeadlineDisplay ? formatDisplayDeadlineTime(userDeadlineDisplay) : userDeadlineDisplay}
            onChange={onChangeInputDeadline}
            placeholder={formatDisplayDeadlineTime(userDeadline).toString()}
          />
        </RowBetween>

        <RowBetween>
          <RowMiddle>
            <TitleField>Expert Mode</TitleField>
            <QuestionHelper text={explainField.transactionDeadline} maxWidth="250px !important" placement="auto" />
          </RowMiddle>
          <Toggle checked={expertMode} onClick={handleExpertModeToggle} onChange={handleExpertModeToggle} />
        </RowBetween>

        {/* <RowBetween>
          <RowMiddle>
            <TitleField>Auto Router API</TitleField>
            <QuestionHelper text={explainField.transactionDeadline} maxWidth="250px !important" />
          </RowMiddle>
          <Toggle checked={!clientSideRouter} onClick={handleClientSideRouter} onChange={handleClientSideRouter} />
        </RowBetween> */}
      </AutoColumn>
    </Modal>
  );
};

const TitleField = styled(Text).attrs({
  scale: 'md',
  mr: '6px',
  fontSize: '14px',
  fontWeight: 400,
  whiteSpace: 'nowrap',
})``;

// const StyledItemGas = styled(RowBetween)<{ active: boolean }>`
//   padding: 12px 20px;
//   background: ${({ theme, active }) => (active ? `${theme.colors.hover} !important` : 'transparent')};
//   border-radius: ${({ theme }) => theme.radius.small};
//   cursor: pointer;

//   &:hover {
//     background: ${({ theme }) => theme.colors.base}4d;
//   }
// `;

const StyledTextError = styled(Text)<{ $error: boolean }>`
  font-size: 10px;
  line-height: 14px;
  color: ${({ $error, theme }) => ($error ? theme.colors.failure : theme.colors.warning)};
  position: absolute;
  left: 4px;
  transform: translateY(4px);
`;

export default React.memo(UserSettingsModal);
