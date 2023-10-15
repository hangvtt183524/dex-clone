import { Column } from 'components/Layout/Column';
import { useCurrency } from 'hooks/Tokens';
import React from 'react';
import { Field } from 'state/swap/actions';
import { useSwapState } from 'state/swap/hooks';
import DoubleSwapPreviewChart from './DoubleSwapPreviewChart';
import SwapDetailsChart from './SwapDetailsChart';

const SwapChart: React.FC = () => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState();

  const currencyA = useCurrency(inputCurrencyId);
  const currencyB = useCurrency(outputCurrencyId);

  return (
    <Column flex="1 1" height="inherit" width="100%">
      <DoubleSwapPreviewChart currencyA={currencyA} currencyB={currencyB} />
      <SwapDetailsChart tokens={[currencyA, currencyB]} />
    </Column>
  );
};

export default SwapChart;
