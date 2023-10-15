import { Box, Grid } from 'components/Box';
import { Card } from 'components/Card';
import { RowCenter } from 'components/Layout/Row';
import React, { useCallback, useState } from 'react';
import { FieldMint } from 'state/mint/actions';
import { useDerivedMintInfo, useMintState } from 'state/mint/hooks';
import styled from 'styled-components';
import { PlusIcon } from 'svgs';

import { urlRoute } from 'config/endpoints';

import { TransactionResponse } from '@ethersproject/providers';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { CommonBasesType } from 'components/CurrencySearchModal/types';
import { AutoColumn, ColumnCenter } from 'components/Layout/Column';
import { Message, MessageText } from 'components/Message';
import { UNSUPPORTED_V2POOL_CHAIN_IDS } from 'config/constants/chains';
import { ZERO_PERCENT } from 'config/constants/misc';
import { Currency, CurrencyAmount } from 'config/sdk-core';
import { BigNumber } from 'ethers';
import { useCurrency } from 'hooks/Tokens';
import { useV2RouterContract } from 'hooks/useContract';
import useModal from 'hooks/useModal';
import useActiveWeb3React from 'hooks/web3React/useActiveWeb3React';
import { useRouter } from 'next/router';
import { useAccount } from 'packages/wagmi/src';
import { Trans } from 'react-i18next';
import { useMintActionHandlers } from 'state/mint/useMintActionHandlers';
import { useTransactionAdder } from 'state/transactions/hooks';
import { TransactionType } from 'state/transactions/types';
import { useIsExpertMode, usePairAdder, useTransactionDeadline, useUserSlippageTolerance } from 'state/user/hooks';
import RoboTheme from 'styles';
import { calculateGasMargin } from 'utils/calculateGasMargin';
import { calculateSlippageAmount, parseSlippagePercent } from 'utils/calculateSlippageAmount';
import currencyId from 'utils/currencyId';
import { getFullDecimals } from 'utils/numbersHelper';
import AdvancedPoolDetails from './AdvancedPoolDetails';
import ConfirmSupplyModal, { SupplyLiquidityErrorModal } from './ConfirmSupplyModal';
import MintAction from './MintAction';
import MintHeader from './MintHeader';

export interface MintProps {
  currencies: {
    [field in FieldMint]?: Currency;
  };
  currencyBalances: {
    [field in FieldMint]?: CurrencyAmount<Currency>;
  };
  parsedTypedAmounts: {
    [field in FieldMint]?: CurrencyAmount<Currency>;
  };
}

const MintForm: React.FC = () => {
  const router = useRouter();
  const { provider, chainId } = useActiveWeb3React();
  const { address } = useAccount();

  const addTransaction = useTransactionAdder();
  const { query } = router;

  // mint state
  const {
    independentField,
    typedValue,
    otherTypedValue,
    [FieldMint.INPUT]: { currencyId: inputCurrencyId },
    [FieldMint.OUTPUT]: { currencyId: outputCurrencyId },
  } = useMintState();

  const currencyA = useCurrency(query.inputCurrency?.toString() || inputCurrencyId);
  const currencyB = useCurrency(query.outputCurrency?.toString() || outputCurrencyId);

  const {
    dependentField,
    currencies,
    pair,
    // pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);

  const unsupportedV2Network = chainId && UNSUPPORTED_V2POOL_CHAIN_IDS.includes(chainId);

  const { onUserInput, onCurrencySelection } = useMintActionHandlers();

  const expertMode = useIsExpertMode();
  const addPair = usePairAdder();
  const routerContract = useV2RouterContract(chainId);

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings
  const [slippage] = useUserSlippageTolerance(); // custom from users
  const allowedSlippage = parseSlippagePercent(slippage);
  const [txHash, setTxHash] = useState<string>('');

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toExact() ?? '',
  };

  const handleRouteCurrency = useCallback(
    (tokenA: Currency, tokenB: Currency) => {
      if (!tokenA || !tokenB) return;

      const addressTokenA = tokenA.isNative ? tokenA.symbol : tokenA.wrapped.address;
      const addressTokenB = tokenB.isNative ? tokenB.symbol : tokenB.wrapped.address;
      router.replace(
        urlRoute.addLiquidity({
          inputCurrency: addressTokenA,
          outputCurrency: addressTokenB,
        }).to,
      );
    },
    [router],
  );

  const handleCurrencyASelect = useCallback(
    (token: Currency) => {
      handleRouteCurrency(token, currencyB);
      onCurrencySelection(FieldMint.INPUT, token);
    },
    [handleRouteCurrency, currencyB, onCurrencySelection],
  );
  const handleCurrencyBSelect = useCallback(
    (token: Currency) => {
      handleRouteCurrency(currencyA, token);
      onCurrencySelection(FieldMint.OUTPUT, token);
    },
    [handleRouteCurrency, currencyA, onCurrencySelection],
  );

  const handleCurrencyAInput = useCallback(
    (val: string) => {
      onUserInput(FieldMint.INPUT, val);
    },
    [onUserInput],
  );

  const handleCurrencyBInput = useCallback(
    (val: string) => {
      onUserInput(FieldMint.OUTPUT, val);
    },
    [onUserInput],
  );
  const handleSwitchCurrency = () => {
    handleRouteCurrency(currencyB, currencyA);
  };

  const handleConfirmDismiss = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    setAttemptingTxn(false);
    handleCurrencyAInput('');
    handleCurrencyBInput('');
  }, [handleCurrencyAInput, handleCurrencyBInput]);

  const onAdd = async () => {
    if (!chainId || !provider || !address || !routerContract) return;
    setTxHash('');

    const { [FieldMint.INPUT]: parsedAmountA, [FieldMint.OUTPUT]: parsedAmountB } = parsedAmounts;
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return;
    }

    const amountsMin = {
      [FieldMint.INPUT]: calculateSlippageAmount(parsedAmountA, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
      [FieldMint.OUTPUT]: calculateSlippageAmount(parsedAmountB, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
    };

    let estimate;
    let method: (...args: any) => Promise<TransactionResponse>;
    let args: Array<string | string[] | number>;
    let value: BigNumber | null;
    if (currencyA.isNative || currencyB.isNative) {
      const tokenBIsETH = currencyB.isNative;
      estimate = routerContract.estimateGas.addLiquidityETH;
      method = routerContract.addLiquidityETH;
      args = [
        (tokenBIsETH ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsETH ? FieldMint.INPUT : FieldMint.OUTPUT].toString(), // token min
        amountsMin[tokenBIsETH ? FieldMint.OUTPUT : FieldMint.INPUT].toString(), // eth min
        address,
        deadline.toString(),
      ];
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).quotient.toString());
    } else {
      estimate = routerContract.estimateGas.addLiquidity;
      method = routerContract.addLiquidity;
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[FieldMint.INPUT].toString(),
        amountsMin[FieldMint.OUTPUT].toString(),
        address,
        deadline.toString(),
      ];
      value = null;
    }

    setAttemptingTxn(true);

    return estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) => {
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        })
          .then((response) => {
            setAttemptingTxn(false);

            addTransaction(response, {
              type: TransactionType.ADD_LIQUIDITY_V2_POOL,
              baseCurrencyId: currencyId(currencyA),
              expectedAmountBaseRaw: parsedAmounts[FieldMint.INPUT]?.quotient.toString() ?? '0',
              quoteCurrencyId: currencyId(currencyB),
              expectedAmountQuoteRaw: parsedAmounts[FieldMint.OUTPUT]?.quotient.toString() ?? '0',
            });
            if (response?.hash) {
              if (pair) {
                addPair(pair);
              }
              setTxHash(response.hash);
              onUserInput(FieldMint.INPUT, '');
              onUserInput(FieldMint.OUTPUT, '');
            }
            return response;
          })
          .catch(() => {
            setAttemptingTxn(false);
          });
      })
      .catch((error) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error);
        }
        onPresentModalErrorSupply();
        return error;
      });
  };

  const isHaveDetail = price && currencies;

  // useEffect(() => {
  //   const fetch = async () => {
  //     const hash = await getContract({
  //       abi: [
  //         {
  //           inputs: [],
  //           name: 'INIT_CODE_HASH',
  //           outputs: [
  //             {
  //               internalType: 'bytes32',
  //               name: '',
  //               type: 'bytes32',
  //             },
  //           ],
  //           stateMutability: 'view',
  //           type: 'function',
  //         },
  //       ],
  //       address: '0x20Ec976bE39d470568548A6bC3a4638F6b736230',
  //       chainId: 11155111,
  //       signer: provider,
  //     }).INIT_CODE_HASH();
  //     console.log('hash:', hash);
  //   };
  //   fetch();
  // }, [provider]);

  const [onPresentModalConfirmSupply] = useModal(
    <ConfirmSupplyModal
      onConfirm={onAdd}
      onCallbackDismiss={handleConfirmDismiss}
      noLiquidity={noLiquidity}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      pair={pair}
      price={price}
      parsedAmounts={parsedAmounts}
      liquidityMinted={liquidityMinted}
      currencies={currencies}
      allowedSlippage={allowedSlippage}
      poolTokenPercentage={poolTokenPercentage}
    />,
    {
      modalId: 'modal-add-liquidity',
      updateOnPropsChange: true,
    },
  );

  const [onPresentModalErrorSupply] = useModal(
      <SupplyLiquidityErrorModal
          message='Supply Liquidity Failed! Maybe you need to increase Slippage Tolerance.'
      />,
      {
          modalId: 'modal-add-liquidity-error'
      }
  );

  const handleSubmit = async () => {
    if (expertMode) {
      onAdd();
    } else {
      if (txHash) {
        setTxHash('');
      }
      onPresentModalConfirmSupply();
    }
    return new Promise((resolve) => {
      resolve(false);
    });
  };

  return (
    <Wrapper>
      <Card radius="12px 12px 0 0">
        <AutoColumn
          style={{
            zIndex: 1,
            position: 'relative',
          }}
        >
          <MintHeader />
          <Grid>
            <CurrencyInputPanel
              selectedToken={currencyA}
              otherSelectedToken={currencyB}
              handleUserInput={handleCurrencyAInput}
              handleCurrencySelect={handleCurrencyASelect}
              balance={getFullDecimals(
                currencyBalances[FieldMint.INPUT]?.toExact(),
                currencies[FieldMint.INPUT]?.decimals,
              )}
              value={formattedAmounts[FieldMint.INPUT]}
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            />
            <RowCenter my="12px">
              <Box>
                <PlusIcon />
              </Box>
            </RowCenter>

            <CurrencyInputPanel
              selectedToken={currencyB}
              otherSelectedToken={currencyA}
              handleUserInput={handleCurrencyBInput}
              handleCurrencySelect={handleCurrencyBSelect}
              balance={getFullDecimals(
                currencyBalances[FieldMint.OUTPUT]?.toExact(),
                currencies[FieldMint.OUTPUT]?.decimals,
              )}
              value={formattedAmounts[FieldMint.OUTPUT]}
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            />
            <AutoColumn gap="md" mt="16px">
              <MintAction
                parsedAmounts={parsedAmounts}
                currencies={currencies}
                error={error || unsupportedV2Network}
                routerAddress={routerContract.address}
                onSubmit={handleSubmit}
              />
            </AutoColumn>
          </Grid>
        </AutoColumn>

        {unsupportedV2Network && (
          <ColumnCenter mt="32px">
            <Message variant="failure">
              <MessageText>
                <Trans>V2 Pool is not available on Layer 2. Switch to Layer 1 Ethereum.</Trans>
              </MessageText>
            </Message>
          </ColumnCenter>
        )}
      </Card>

      {isHaveDetail && (
        <Card radius="0 0 12px 12px " boxShadow="form">
          <AdvancedPoolDetails
            tokenIn={parsedAmounts[independentField]}
            tokenOut={parsedAmounts[dependentField]}
            price={price}
            pair={pair}
            noLiquidity={noLiquidity}
            liquidityMinted={liquidityMinted}
            poolTokenPercentage={poolTokenPercentage}
            currencies={currencies}
            allowedSlippage={allowedSlippage}
          />
        </Card>
      )}
    </Wrapper>
  );
};

const Wrapper = styled(AutoColumn).attrs({
  gap: '4px',
  maxWidth: '500px',
  width: '100%',
  boxShadow: RoboTheme.shadows.form,
})`
  width: 100%;
  max-width: 500px;
`;

export default MintForm;
