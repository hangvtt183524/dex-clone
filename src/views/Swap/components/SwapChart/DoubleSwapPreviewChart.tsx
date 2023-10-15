import { BoxProps, Grid } from 'components/Box';
import { Currency } from 'config/sdk-core';
import React from 'react';
import SwapPreviewChart from './SwapPreviewChart';

const DoubleSwapPreviewChart: React.FC<
  {
    currencyA: Currency;
    currencyB: Currency;
  } & BoxProps
> = ({ currencyA, currencyB, ...props }) => {
  return (
    <Grid gridTemplateColumns={['1fr', '', '', '1fr 1fr']} gridGap="16px" mb="16px" height="fit-content" {...props}>
      <SwapPreviewChart currency={currencyA} />
      <SwapPreviewChart currency={currencyB} />
    </Grid>
  );
};

export default DoubleSwapPreviewChart;
