import { Box } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import { Card } from 'components/Card';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { CommonBasesType } from 'components/CurrencySearchModal/types';
import { AutoColumn } from 'components/Layout/Column';
import { Row, RowCenter } from 'components/Layout/Row';
import { Trade } from 'config/router-sdk';
import { Currency, CurrencyAmount, Percent, Token, TradeType } from 'config/sdk-core';
import useModal from 'hooks/useModal';
import { useStableUSDValue } from 'hooks/usePrices/useStablecoinPrice';
import { useSwapCallback } from 'hooks/useSwapCallback';
import React, { useCallback, useMemo, useState } from 'react';
import { InterfaceTrade, TradeState } from 'state/routing/types';
import { Field } from 'state/swap/actions';
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks';
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers';
import { useExpertModeManager } from 'state/user/hooks';
import styled from 'styled-components';
import RoboTheme from 'styles';
import { ArrowYSwitchIcon } from 'svgs';
import { computeFiatValuePriceImpact } from 'utils/computeFiatValuePriceImpact';
import currencyId from 'utils/currencyId';
import { currencyAmountToPreciseFloat, getFullDecimals } from 'utils/numbersHelper';
import { computeRealizedPriceImpact, warningSeverity } from 'utils/prices';
import { replaceParamHistory } from 'utils/urlHelper';
import useWrapCallback, { WrapType } from 'utils/useWrapCallback';
import AdvancedSwapDetails from './AdvancedSwapDetails';
import ConfirmSwapModal from './ConfirmSwapModal';
import PriceImpactWarning from './PriceImpactWarning';
import SwapAction from './SwapAction';
import SwapHeader from './SwapHeader';
import confirmPriceImpactWithoutFee from './confirmPriceImpactWithoutFee';

function largerPercentValue(a?: Percent, b?: Percent) {
  if (a && b) {
    return a.greaterThan(b) ? a : b;
  }
  if (a) {
    return a;
  }
  if (b) {
    return b;
  }
  return undefined;
}

const SwapForm: React.FC = () => {
  const { independentField, typedValue, recipient } = useSwapState();

  const {
    trade: { state: tradeState, trade, isUniswap },
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();

  const isValid = !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers();

  // for expert mode
  const [isExpertMode] = useExpertModeManager();

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash, tradeStore }, setSwapState] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
    tradeStore: InterfaceTrade<Currency, Currency, TradeType> | undefined;
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
    tradeStore: undefined,
  });

  // wrap
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade],
  );

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : currencyAmountToPreciseFloat(parsedAmounts[dependentField]),
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue],
  );

  const [routeIsLoading, routeIsSyncing] = useMemo(
    () => [TradeState.LOADING === tradeState, TradeState.SYNCING === tradeState],
    [tradeState],
  );

  const fiatValueInput = useStableUSDValue(parsedAmounts[Field.INPUT]) as CurrencyAmount<Token>;
  const fiatValueOutput = useStableUSDValue(parsedAmounts[Field.OUTPUT]) as CurrencyAmount<Token>;

  const stablecoinPriceImpact = useMemo(
    () => (routeIsSyncing ? undefined : computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)),
    [fiatValueInput, fiatValueOutput, routeIsSyncing],
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    isUniswap,
  );

  // warnings on the greater of fiat value price impact and execution price impact
  const { priceImpactSeverity, largerPriceImpact } = useMemo(() => {
    const marketPriceImpact = trade?.priceImpact ? computeRealizedPriceImpact(trade) : undefined;
    const largerPriceImpact = largerPercentValue(marketPriceImpact, stablecoinPriceImpact);
    return {
      priceImpactSeverity: warningSeverity(largerPriceImpact),
      largerPriceImpact,
    };
  }, [stablecoinPriceImpact, trade]);

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput],
  );

  const handleClearInput = useCallback(() => {
    handleTypeInput('');
    handleTypeOutput('');
  }, [handleTypeInput, handleTypeOutput]);

  const handleInputSelect = useCallback(
    (currencyInput) => {
      handleClearInput();
      onCurrencySelection(Field.INPUT, currencyInput);
      replaceParamHistory('inputCurrency', currencyId(currencyInput));
    },
    [handleClearInput, onCurrencySelection],
  );

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      handleClearInput();
      onCurrencySelection(Field.OUTPUT, currencyOutput);
      replaceParamHistory('outputCurrency', currencyId(currencyOutput));
    },

    [handleClearInput, onCurrencySelection],
  );

  const handleOnSwitchToken = useCallback(() => {
    onSwitchTokens();
    replaceParamHistory('inputCurrency', currencyId(currencies[Field.OUTPUT]));
    replaceParamHistory('outputCurrency', currencyId(currencies[Field.INPUT]));
  }, [onSwitchTokens, currencies]);

  const handleConfirmDismiss = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      setSwapState({
        tradeToConfirm: undefined,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
        tradeStore: undefined,
      });
      onUserInput(Field.INPUT, '');
      onUserInput(Field.OUTPUT, '');
    }
  }, [onUserInput, txHash]);

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return;
    }
    if (stablecoinPriceImpact && !confirmPriceImpactWithoutFee(stablecoinPriceImpact)) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
      tradeStore: trade,
    });
    return swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
          tradeStore: trade,
        });
        if (hash) {
          onUserInput(Field.INPUT, '');
          onUserInput(Field.OUTPUT, '');
        }
        return {
          hash,
        };
      })
      .catch((error) => {
        if (error?.message === 'Transaction rejected') {
          return setSwapState((preState) => ({
            ...preState,
            attemptingTxn: false,
          }));
        }
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error?.message || error,
          txHash: undefined,
          tradeStore: undefined,
        });
      });
  }, [swapCallback, stablecoinPriceImpact, tradeToConfirm, trade, onUserInput]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      tradeStore: trade,
    });
  }, [attemptingTxn, swapErrorMessage, trade, txHash]);

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;
  const showPriceImpactWarning = largerPriceImpact && priceImpactSeverity > 3;

  const [onPresentModal] = useModal(
    <ConfirmSwapModal
      trade={trade || tradeStore}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      onCallbackDismiss={handleConfirmDismiss}
      fiatValueInput={fiatValueInput}
      fiatValueOutput={fiatValueOutput}
    />,
    {
      modalId: 'confirm-swap',
      updateOnPropsChange: true,
    },
  );

  return (
    <Wrapper>
      <Card radius="12px 12px 0 0">
        <AutoColumn>
          <Box mb="20px">
            <SwapHeader />
          </Box>
          <AutoColumn>
            <CurrencyInputPanel
              selectedToken={currencies[Field.INPUT]}
              otherSelectedToken={currencies[Field.OUTPUT]}
              handleUserInput={handleTypeInput}
              handleCurrencySelect={handleInputSelect}
              balance={getFullDecimals(currencyBalances[Field.INPUT]?.toExact(), currencies[Field.INPUT]?.decimals)}
              value={formattedAmounts[Field.INPUT]}
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
              fiatValue={fiatValueInput ?? undefined}
            />
            <RowCenter my="12px">
              <IconButton onClick={handleOnSwitchToken}>
                <ArrowYSwitchIcon />
              </IconButton>
            </RowCenter>

            <CurrencyInputPanel
              selectedToken={currencies[Field.OUTPUT]}
              otherSelectedToken={currencies[Field.INPUT]}
              handleUserInput={handleTypeOutput}
              handleCurrencySelect={handleOutputSelect}
              balance={getFullDecimals(currencyBalances[Field.OUTPUT]?.toExact(), currencies[Field.OUTPUT]?.decimals)}
              value={formattedAmounts[Field.OUTPUT]}
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
              priceImpact={stablecoinPriceImpact}
              fiatValue={fiatValueOutput ?? undefined}
              disabledPercent
            />
            {showPriceImpactWarning && <PriceImpactWarning priceImpact={largerPriceImpact} />}

            <Row mt="24px">
              <SwapAction
                error={swapInputError}
                disabled={!isValid || routeIsSyncing || routeIsLoading || priceImpactTooHigh || !!swapCallbackError}
                currencies={currencies}
                parsedAmounts={parsedAmounts}
                typedValue={typedValue}
                independentField={independentField}
                wrapType={wrapType}
                wrapInputError={wrapInputError}
                trade={trade}
                tradeState={tradeState}
                allowedSlippage={allowedSlippage}
                showWrap={showWrap}
                priceImpactTooHigh={priceImpactTooHigh}
                priceImpactSeverity={priceImpactSeverity}
                onWrap={onWrap}
                isUniswap={isUniswap}
                onSubmit={() => {
                  if (isExpertMode) {
                    return handleSwap();
                  }
                  setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    txHash: undefined,
                    tradeStore: trade,
                  });
                  onPresentModal();
                  return new Promise((resolve) => {
                    resolve(false);
                  });
                }}
              />
            </Row>
          </AutoColumn>
        </AutoColumn>
      </Card>

      <Card
        boxShadow="form"
        radius="0 0 12px 12px"
        style={{
          boxShadow: RoboTheme.shadows.form,
        }}
      >
        <AdvancedSwapDetails allowedSlippage={allowedSlippage} trade={trade} />
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled(AutoColumn).attrs({
  gap: '4px',
  width: '100%',
  maxWidth: '500px',
  mx: 'auto',
})``;

export default SwapForm;
