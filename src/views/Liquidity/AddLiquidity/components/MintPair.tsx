import IconButton from 'components/Button/IconButton';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import { CommonBasesType } from 'components/CurrencySearchModal/types';
import { Column } from 'components/Layout/Column';
import { RowCenter } from 'components/Layout/Row';
import React, { useCallback } from 'react';
import { ArrowYSwitchIcon } from 'svgs';
import currencyId from 'utils/currencyId';
import { FieldMint } from 'state/mint/actions';
import { useMintState } from 'state/mint/hooks';
import { useRouter } from 'next/router';
import { useMintActionHandlers } from 'state/mint/useMintActionHandlers';
import { urlRoute } from 'config/endpoints';
import { getFullDecimals } from 'utils/numbersHelper';
import { MintProps } from './MintForm';

const MintPair: React.FC<MintProps> = ({
  currencies,
  currencyBalances,
  // parsedTypedAmounts,
}) => {
  const router = useRouter();
  const { typedValue, otherTypedValue } = useMintState();
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useMintActionHandlers();
  const currencyInput = currencies[FieldMint.INPUT] || null;
  const currencyOutput = currencies[FieldMint.OUTPUT] || null;

  const formattedAmounts = {
    [FieldMint.INPUT]: Number(typedValue) ? typedValue : '',
    [FieldMint.OUTPUT]: Number(otherTypedValue) ? otherTypedValue : '',
  };

  const replaceQuery = useCallback(
    ({ inputCurrency = '', outputCurrency = '' }: { inputCurrency?: string; outputCurrency?: string }) => {
      const inputCurrencyCheck = inputCurrency || router.query?.inputCurrency?.toString();
      const outputCurrencyCheck = outputCurrency || router.query?.outputCurrency?.toString();
      router.replace(
        urlRoute.addLiquidity({
          inputCurrency: inputCurrencyCheck,
          outputCurrency: outputCurrencyCheck,
        }).to,
        '',
        {
          shallow: true,
        },
      );
    },
    [router],
  );

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(FieldMint.INPUT, value);
    },
    [onUserInput],
  );

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(FieldMint.OUTPUT, value);
    },
    [onUserInput],
  );

  const handleInputSelect = useCallback(
    (currencyInput) => {
      onCurrencySelection(FieldMint.INPUT, currencyInput);
      replaceQuery({
        inputCurrency: currencyId(currencyInput),
      });
    },
    [onCurrencySelection, replaceQuery],
  );

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(FieldMint.OUTPUT, currencyOutput);
      replaceQuery({
        outputCurrency: currencyId(currencyOutput),
      });
    },

    [onCurrencySelection, replaceQuery],
  );

  const handleOnSwitchToken = useCallback(() => {
    onSwitchTokens();
    replaceQuery({
      inputCurrency: currencyId(currencyOutput),
    });
    replaceQuery({
      outputCurrency: currencyId(currencyInput),
    });
  }, [onSwitchTokens, replaceQuery, currencyOutput, currencyInput]);

  return (
    <Column>
      <CurrencyInputPanel
        selectedToken={currencyInput}
        otherSelectedToken={currencyOutput}
        handleUserInput={handleTypeInput}
        handleCurrencySelect={handleInputSelect}
        balance={getFullDecimals(currencyBalances[FieldMint.INPUT]?.toExact(), currencies[FieldMint.INPUT]?.decimals)}
        value={formattedAmounts[FieldMint.INPUT]}
        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
      />

      <RowCenter my="12px">
        <IconButton onClick={handleOnSwitchToken}>
          <ArrowYSwitchIcon />
        </IconButton>
      </RowCenter>

      <CurrencyInputPanel
        selectedToken={currencyOutput}
        otherSelectedToken={currencyInput}
        handleUserInput={handleTypeOutput}
        handleCurrencySelect={handleOutputSelect}
        balance={getFullDecimals(currencyBalances[FieldMint.OUTPUT]?.toExact(), currencies[FieldMint.INPUT]?.decimals)}
        value={formattedAmounts[FieldMint.OUTPUT]}
        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
      />

      {/* <MintAction /> */}
    </Column>
  );
};

export default MintPair;
