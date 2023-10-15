import { TransactionResponse } from '@ethersproject/providers';
import BigNumber from 'bignumber.js';
import { Box, Grid } from 'components/Box';
import IconButton from 'components/Button/IconButton';
import ButtonGroup from 'components/ButtonGroup/ButtonGroup';
import ButtonItemGroup from 'components/ButtonGroup/ButtonItemGroup';
import { Card } from 'components/Card';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { AutoColumn, ColumnCenter } from 'components/Layout/Column';
import { Row, RowBetween, RowFixed } from 'components/Layout/Row';
import LinkExternal from 'components/Link/LinkExternal';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import { Message, MessageText } from 'components/Message';
import PairInputPanel from 'components/PairInputPanel';
import { MinimalPositionCard } from 'components/PositionCard';
import Slider from 'components/Slider';
import Text from 'components/Text';
import { UNSUPPORTED_V2POOL_CHAIN_IDS } from 'config/constants/chains';
import { urlRoute } from 'config/endpoints';
import { Currency, Percent } from 'config/sdk-core';
import { WRAPPED_NATIVE_CURRENCY } from 'config/tokens';
import { useCurrency } from 'hooks/Tokens';
import { ApprovalState } from 'hooks/useApproval';
import { useCurrencyBalance } from 'hooks/useBalances';
import { useBurnApproveCallback } from 'hooks/useBurnApproveCallback';
import { useV2RouterContract } from 'hooks/useContract';
import useDebouncedChangeHandler from 'hooks/useDebouncedChangeHandler';
import useModal from 'hooks/useModal';
import { useV2LiquidityTokenPermit } from 'hooks/useV2LiquidityTokenPermit';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useRouter } from 'next/router';
import { useAccount } from 'packages/wagmi/src';
import React, { useCallback, useMemo, useState } from 'react';
import { Trans } from 'react-i18next';
import { FieldBurn } from 'state/burn/actions';
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'state/burn/hooks';
import { useTransactionAdder } from 'state/transactions/hooks';
import { TransactionType } from 'state/transactions/types';
import { useTransactionDeadline, useUserSlippageTolerance } from 'state/user/hooks';
import styled, { css } from 'styled-components';
import RoboTheme from 'styles';
import { breakpointMap } from 'styles/base';
import { ArrowDownIcon, PlusIcon } from 'svgs';
import { calculateGasMargin } from 'utils/calculateGasMargin';
import { calculateSlippageAmount, parseSlippagePercent } from 'utils/calculateSlippageAmount';
import currencyId from 'utils/currencyId';
import { formatTransactionAmount, getFullDecimals, priceToPreciseFloat } from 'utils/numbersHelper';
import BurnAction from './BurnAction';
import BurnHeader from './BurnHeader';
import ModalConfirmRemoveLiquidity from './ModalConfirmRemoveLiquidity';

const percents = [25, 50, 75, 100];
const BurnForm: React.FC = () => {
  const router = useRouter();
  const { provider, chainId } = useActiveWeb3React();
  const { address } = useAccount();

  const { query } = router;

  const currencyIdA = query.inputCurrency?.toString();
  const currencyIdB = query.outputCurrency?.toString();

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB]);

  // burn state
  const { independentField, typedValue } = useBurnState();
  const { pair, parsedAmounts, error, price } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined);
  const { onUserInput: _onUserInput } = useBurnActionHandlers();

  // modal and loading
  const [showDetailed, setShowDetailed] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState(false); // clicked confirm

  const unsupportedV2Network = chainId && UNSUPPORTED_V2POOL_CHAIN_IDS.includes(chainId);

  // txn values
  const [txHash, setTxHash] = useState<string>('');
  const deadline = useTransactionDeadline();
  const [slippage] = useUserSlippageTolerance(); // custom from users
  const allowedSlippage = parseSlippagePercent(slippage);

  const formattedAmounts = useMemo(
    () => ({
      [FieldBurn.LIQUIDITY_PERCENT]: parsedAmounts[FieldBurn.LIQUIDITY_PERCENT].equalTo('0')
        ? '0'
        : parsedAmounts[FieldBurn.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
        ? '<1'
        : parsedAmounts[FieldBurn.LIQUIDITY_PERCENT].toFixed(0),
      [FieldBurn.LIQUIDITY]:
        independentField === FieldBurn.LIQUIDITY
          ? typedValue
          : parsedAmounts[FieldBurn.LIQUIDITY]?.toExact() ?? '',
      [FieldBurn.CURRENCY_A]:
        independentField === FieldBurn.CURRENCY_A
          ? typedValue
          : (parsedAmounts[FieldBurn.CURRENCY_A]?.toExact()?.length > 21 ? `${parsedAmounts[FieldBurn.CURRENCY_A]?.toExact().substring(0, 21)}...` : parsedAmounts[FieldBurn.CURRENCY_A]?.toExact()) ?? '',
      [FieldBurn.CURRENCY_B]:
        independentField === FieldBurn.CURRENCY_B
          ? typedValue
          : (parsedAmounts[FieldBurn.CURRENCY_B]?.toExact()?.length > 21 ? `${parsedAmounts[FieldBurn.CURRENCY_B]?.toExact().substring(0, 21)}...` : parsedAmounts[FieldBurn.CURRENCY_B]?.toExact()) ?? '',
    }),
    [independentField, parsedAmounts, typedValue],
  );

  const atMaxAmount = parsedAmounts[FieldBurn.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'));

  const routerContract = useV2RouterContract(chainId);

  // allowance handling
  const { signatureData, gatherPermitSignature } = useV2LiquidityTokenPermit(
    parsedAmounts[FieldBurn.LIQUIDITY],
    routerContract?.address,
  );

  const [approvalState, approveCallback] = useBurnApproveCallback({
    parsedAmounts,
    pair,
    gatherPermitSignature,
  });

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: FieldBurn, typedValue: string) => {
      return _onUserInput(field, typedValue);
    },
    [_onUserInput],
  );

  const onLiquidityInput = useCallback(
    (typedValue: string): void => onUserInput(FieldBurn.LIQUIDITY, typedValue),
    [onUserInput],
  );
  const onCurrencyAInput = useCallback(
    (typedValue: string): void => onUserInput(FieldBurn.CURRENCY_A, typedValue),
    [onUserInput],
  );
  const onCurrencyBInput = useCallback(
    (typedValue: string): void => onUserInput(FieldBurn.CURRENCY_B, typedValue),
    [onUserInput],
  );

  // tx sending
  const addTransaction = useTransactionAdder();
  const selectedCurrencyBalance = useCurrencyBalance(address ?? undefined, pair?.liquidityToken ?? undefined);

  const handleRemove = async () => {
    if (!chainId || !provider || !address || !deadline || !routerContract) throw new Error('missing dependencies');
    const { [FieldBurn.CURRENCY_A]: currencyAmountA, [FieldBurn.CURRENCY_B]: currencyAmountB } = parsedAmounts;
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts');
    }

    const amountsMin = {
      [FieldBurn.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [FieldBurn.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    };

    if (!currencyA || !currencyB) throw new Error('missing tokens');
    const liquidityAmount = parsedAmounts[FieldBurn.LIQUIDITY];
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    const currencyBIsETH = currencyB.isNative;
    const oneCurrencyIsETH = currencyA.isNative || currencyBIsETH;

    if (!tokenA || !tokenB) throw new Error('could not wrap');

    let methodNames: string[];
    let args: Array<string | string[] | number | boolean>;
    // we have approval, use normal remove liquidity
    if (approvalState === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens'];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsETH ? FieldBurn.CURRENCY_A : FieldBurn.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? FieldBurn.CURRENCY_B : FieldBurn.CURRENCY_A].toString(),
          address,
          deadline.toHexString(),
        ];
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[FieldBurn.CURRENCY_A].toString(),
          amountsMin[FieldBurn.CURRENCY_B].toString(),
          address,
          deadline.toHexString(),
        ];
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'];
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsETH ? FieldBurn.CURRENCY_A : FieldBurn.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? FieldBurn.CURRENCY_B : FieldBurn.CURRENCY_A].toString(),
          address,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit'];
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[FieldBurn.CURRENCY_A].toString(),
          amountsMin[FieldBurn.CURRENCY_B].toString(),
          address,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ];
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.');
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then((estimateGas) => calculateGasMargin(estimateGas))
          .catch((error) => {
            console.error('estimateGas failed', methodName, args, error);
            return undefined;
          }),
      ),
    );

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate),
    );

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.');
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation];
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

      setAttemptingTxn(true);
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false);

          addTransaction(response, {
            type: TransactionType.REMOVE_LIQUIDITY_V3,
            baseCurrencyId: currencyId(currencyA),
            quoteCurrencyId: currencyId(currencyB),
            expectedAmountBaseRaw: parsedAmounts[FieldBurn.CURRENCY_A]?.quotient.toString() ?? '0',
            expectedAmountQuoteRaw: parsedAmounts[FieldBurn.CURRENCY_B]?.quotient.toString() ?? '0',
          });
          onUserInput(FieldBurn.CURRENCY_A, '');
          onUserInput(FieldBurn.CURRENCY_B, '');
          setTxHash(response.hash);
        })
        .catch((error: Error) => {
          setAttemptingTxn(false);
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error);
        });
    }
  };

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(FieldBurn.LIQUIDITY_PERCENT, value.toString());
    },
    [onUserInput],
  );

  const oneCurrencyIsETH = currencyA?.isNative || currencyB?.isNative;

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      WRAPPED_NATIVE_CURRENCY[chainId] &&
      ((currencyA && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyA)) ||
        (currencyB && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyB))),
  );

  const handleRouteCurrency = useCallback(
    (tokenA: Currency, tokenB: Currency) => {
      const addressTokenA = tokenA.isNative ? tokenA.symbol : tokenA.wrapped.address;
      const addressTokenB = tokenB.isNative ? tokenB.symbol : tokenB.wrapped.address;
      router.replace(
        urlRoute.removeLiquidity({
          inputCurrency: addressTokenA,
          outputCurrency: addressTokenB,
        }).to,
      );
    },
    [router],
  );

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      handleRouteCurrency(currency, currencyB);
    },
    [currencyB, handleRouteCurrency],
  );
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      handleRouteCurrency(currencyA, currency);
    },
    [currencyA, handleRouteCurrency],
  );

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(FieldBurn.LIQUIDITY_PERCENT, '0');
    }
    setTxHash('');
  }, [onUserInput, txHash]);

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[FieldBurn.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  );

  const [onPresentModalConfirmBurn] = useModal(
    <ModalConfirmRemoveLiquidity
      pair={pair}
      approval={approvalState}
      signatureData={signatureData}
      parsedAmounts={parsedAmounts}
      allowedSlippage={allowedSlippage}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      currencyA={currencyA}
      currencyB={currencyB}
      handleRemove={handleRemove}
      callBackDismiss={handleDismissConfirmation}
    />,
    {
      modalId: 'remove-liquidity',
      updateOnPropsChange: true,
    },
  );

  const renderInputPercentLiquidity = useMemo(
    () => (
      <ButtonGroup>
        {percents.map((percent) => (
          <ButtonItemGroup
            height="28px"
            key={percent}
            active={formattedAmounts[FieldBurn.LIQUIDITY_PERCENT] === percent.toString()}
            onClick={() => onUserInput(FieldBurn.LIQUIDITY_PERCENT, percent.toString())}
          >
            {percent}%
          </ButtonItemGroup>
        ))}
      </ButtonGroup>
    ),
    [formattedAmounts, onUserInput],
  );

  return (
    <Wrapper>
      <BurnHeader />
      <StyledCard $outner p="16px !important" my="16px">
        <Text fontWeight={400} fontSize="12px" lineHeight="18px" color="textSubtle" textAlign="center">
          <Trans>
            <b style={{ color: '#FFF', textDecoration: 'underline' }}>Tip:</b> Removing pool tokens converts your
            position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued
            fees are included in the amounts you receive.
          </Trans>
        </Text>
      </StyledCard>
      <Grid gridTemplateColumns={['1fr', '', '', '', '1fr 1px 1fr']} gridGap="24px">
        <AutoColumn gap="4px">
          <StyledCard>
            <AutoColumn gap={showDetailed ? '10px' : '20px'}>
              <RowBetween>
                <Text fontWeight={500}>
                  <Trans>Remove Amount</Trans>
                </Text>
                <IconButton
                  fontWeight={500}
                  style={{
                    color: RoboTheme.colors.textSubtle,
                  }}
                  onClick={() => {
                    setShowDetailed(!showDetailed);
                  }}
                >
                  <Text fontWeight={600} gradient={RoboTheme.colors.gradients.primary}>
                    {showDetailed ? <Trans>Simple</Trans> : <Trans>Detailed</Trans>}
                  </Text>
                </IconButton>
              </RowBetween>
              <Row alignItems="flex-end">
                <Text fontSize={showDetailed ? '32px' : '42px'} color="textSubtle" fontWeight={500}>
                  {formattedAmounts[FieldBurn.LIQUIDITY_PERCENT]}%
                </Text>
              </Row>
              {!showDetailed && (
                <>
                  <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />

                  {renderInputPercentLiquidity}
                </>
              )}
            </AutoColumn>
          </StyledCard>

          {!showDetailed && currencyA && currencyB && (
            <>
              <ColumnCenter>
                <ArrowDownIcon size="16" color="textSubtle" />
              </ColumnCenter>
              <StyledCard>
                <AutoColumn gap="10px">
                  <RowBetween>
                    <Text fontSize={['16px', '16px', '20px']} fontWeight={500}>
                      {formattedAmounts[FieldBurn.CURRENCY_A] || '-'}
                    </Text>
                    <RowFixed>
                      <CurrencyLogo currency={currencyA} style={{ marginRight: '12px' }} />
                      <Text fontSize="20px" fontWeight={500} id="remove-liquidity-tokena-symbol">
                        {currencyA?.symbol}
                      </Text>
                    </RowFixed>
                  </RowBetween>
                  <RowBetween>
                    <Text fontSize={['16px', '16px', '20px']} fontWeight={500}>
                      {formattedAmounts[FieldBurn.CURRENCY_B] || '-'}
                    </Text>
                    <RowFixed>
                      <CurrencyLogo currency={currencyB} style={{ marginRight: '12px' }} />
                      <Text fontSize="20px" fontWeight={500} id="remove-liquidity-tokenb-symbol">
                        {currencyB?.symbol}
                      </Text>
                    </RowFixed>
                  </RowBetween>
                  {chainId && (oneCurrencyIsWETH || oneCurrencyIsETH) ? (
                    <RowBetween style={{ justifyContent: 'flex-end' }} mt="4px">
                      {oneCurrencyIsETH ? (
                        <LinkExternal
                          fontSize="14px"
                          href={
                            urlRoute.removeLiquidity({
                              inputCurrency:
                                currencyA?.isNative && chainId && WRAPPED_NATIVE_CURRENCY[chainId]
                                  ? WRAPPED_NATIVE_CURRENCY[chainId]?.address
                                  : currencyIdA,
                              outputCurrency:
                                currencyB?.isNative && chainId && WRAPPED_NATIVE_CURRENCY[chainId]
                                  ? WRAPPED_NATIVE_CURRENCY[chainId]?.address
                                  : currencyIdB,
                            }).to
                          }
                        >
                          <Text mt="4px" fontSize="14px" color="textSubtle" lineHeight="14px">
                            Receive WETH
                          </Text>
                        </LinkExternal>
                      ) : oneCurrencyIsWETH ? (
                        <LinkExternal
                          href={
                            urlRoute.removeLiquidity({
                              inputCurrency:
                                currencyA && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyA) ? 'ETH' : currencyIdA,
                              outputCurrency:
                                currencyB && WRAPPED_NATIVE_CURRENCY[chainId]?.equals(currencyB) ? 'ETH' : currencyIdB,
                            }).to
                          }
                        >
                          <Text fontSize="14px" color="textSubtle" lineHeight="14px" mr="8px">
                            Receive ETH
                          </Text>
                        </LinkExternal>
                      ) : null}
                    </RowBetween>
                  ) : null}
                </AutoColumn>
              </StyledCard>
            </>
          )}

          {showDetailed && (
            <>
              <PairInputPanel
                value={formattedAmounts[FieldBurn.LIQUIDITY]}
                handleUserInput={onLiquidityInput}
                handleMax={(val) => {
                  onUserInput(FieldBurn.LIQUIDITY_PERCENT, val);
                }}
                pair={pair}
                id="liquidity-amount"
                balance={getFullDecimals(
                  selectedCurrencyBalance?.toExact(),
                  selectedCurrencyBalance?.currency?.decimals,
                )}
              />
              <ColumnCenter my="4px">
                <ArrowDownIcon size="16" color="textSubtle" />
              </ColumnCenter>
              <CurrencyInputPanel
                hideBalance
                value={formattedAmounts[FieldBurn.CURRENCY_A]}
                handleUserInput={onCurrencyAInput}
                handleMax={() => onUserInput(FieldBurn.LIQUIDITY_PERCENT, '100')}
                showMaxButton={!atMaxAmount}
                selectedToken={currencyA}
                // label="Output"
                handleCurrencySelect={handleSelectCurrencyA}
                id="remove-liquidity-tokena"
                background={RoboTheme.colors.inputSecondary}
                style={{
                  backdropFilter: 'unset',
                }}
                p={['12px 20px !important']}
              />
              <ColumnCenter>
                <PlusIcon size="24px" color="textSubtle" />
              </ColumnCenter>
              <CurrencyInputPanel
                hideBalance
                value={formattedAmounts[FieldBurn.CURRENCY_B]}
                handleUserInput={onCurrencyBInput}
                handleMax={() => onUserInput(FieldBurn.LIQUIDITY_PERCENT, '100')}
                showMaxButton={!atMaxAmount}
                selectedToken={currencyB}
                // label="Output"
                handleCurrencySelect={handleSelectCurrencyB}
                id="remove-liquidity-tokenb"
                background={RoboTheme.colors.inputSecondary}
                style={{
                  backdropFilter: 'unset',
                }}
                p={['12px 20px !important']}
              />
            </>
          )}
          <Box mt="20px">
            <BurnAction
              parsedAmounts={parsedAmounts}
              pair={pair}
              signatureData={signatureData}
              approvalState={approvalState}
              approveCallback={approveCallback}
              handleRemove={onPresentModalConfirmBurn}
              error={error}
            />

            {unsupportedV2Network && (
              <ColumnCenter mt="32px">
                <Message variant="failure">
                  <MessageText>
                    <Trans>V2 Pool is not available on Layer 2. Switch to Layer 1 Ethereum.</Trans>
                  </MessageText>
                </Message>
              </ColumnCenter>
            )}
          </Box>
        </AutoColumn>
        <StyledStroke />
        <Box>
          <MinimalPositionCard
            background="transparent"
            radius="small"
            showUnwrapped={oneCurrencyIsWETH}
            pair={pair}
            style={{
              border: `1px solid ${RoboTheme.colors.strokeAlt}`,
            }}
          />

          <Card
            background="transparent"
            radius="small"
            style={{
              border: `1px solid ${RoboTheme.colors.strokeAlt}`,
            }}
            my="12px"
          >
            <RowBetween mb="8px">
              <Text color="textSubtle">
                <Trans>Price:</Trans>
              </Text>
              <Text>{price ? `1 ${currencyA?.symbol} = ${price ? formatTransactionAmount(priceToPreciseFloat(price)) : '0'} ${currencyB?.symbol}` : '-'}</Text>
            </RowBetween>
            <RowBetween style={{ justifyContent: 'flex-end' }}>
              <Text>
                {price ? `1 ${currencyB?.symbol} = ${price?.invert().toSignificant(4)} ${currencyA?.symbol}` : '-'}
              </Text>
            </RowBetween>
          </Card>

          {/* <Card
            radius="small"
            background="linear-gradient(96.73deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.025) 99%)"
            p={['6px 14px !important', '', '12px 20px !important']}
          >
            <Text fontWeight={400}>
              <Trans>
                By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the
                pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
              </Trans>{' '}
            </Text>
          </Card> */}
        </Box>
      </Grid>
    </Wrapper>
  );
};
const Wrapper = styled(Card).attrs({
  gap: '4px',
  maxWidth: breakpointMap.lg,
  boxShadow: RoboTheme.shadows.form,
  width: '100%',
  margin: '0 auto',
})`
  width: 100%;
`;

const StyledCard = styled(Card)<{ $outner?: boolean }>`
  background: ${({ theme }) => theme.colors.inputSecondary};
  border-radius: ${({ theme }) => theme.radius.medium};

  ${({ $outner }) =>
    $outner &&
    css`
      background: transparent;
      border: 1px solid ${({ theme }) => theme.colors.strokeSec};
    `}
`;

const StyledStroke = styled(Box)`
  background: ${({ theme }) => theme.colors.strokeAlt};
  width: 1px;
  height: 100%;
`;
export default BurnForm;
