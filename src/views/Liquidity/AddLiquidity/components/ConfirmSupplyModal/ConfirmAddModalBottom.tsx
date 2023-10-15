import { Fraction, Currency, CurrencyAmount, Percent } from 'config/sdk-core';
import { RowBetween, RowCenter, RowFixed } from 'components/Layout/Row';
import CurrencyLogo from 'components/Logo/CurrencyLogo';
import { Trans } from 'react-i18next';

import Text from 'components/Text';
import { FieldMint } from 'state/mint/actions';
import Button from 'components/Button';
import { Box, Grid } from 'components/Box';
import RoboTheme from 'styles';
import { AutoColumn } from 'components/Layout/Column';
import IconButton from 'components/Button/IconButton';
import styled from 'styled-components';
import React from 'react';
import { formatTransactionAmount, priceToPreciseFloat } from 'utils/numbersHelper';

const StyledTitle = styled(Text).attrs({
  color: 'textSubtle',
  fontWeight: 400,
})`
  font-size: 14px;
`;

const StyledValue = styled(Text).attrs({
  color: 'text',
  fontWeight: 500,
})`
  font-size: 14px;
  white-space: nowrap;
`;
const ConfirmAddModalBottom = ({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
  onDismiss,
}: {
  noLiquidity?: boolean;
  price?: any;
  currencies: { [field in FieldMint]?: Currency };
  parsedAmounts: { [field in FieldMint]?: CurrencyAmount<Currency> };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
  onDismiss: () => void;
}) => {
  const tokenIn = parsedAmounts[FieldMint.INPUT];
  const tokenOut = parsedAmounts[FieldMint.OUTPUT];

  const currencyA = currencies[FieldMint.INPUT];
  const currencyB = currencies[FieldMint.OUTPUT];

  return (
    <>
      <Box mt="10px" />
      <RowBetween>
        <StyledTitle>{currencyA.symbol} Deposited:</StyledTitle>
        <RowFixed>
          <CurrencyLogo currency={currencyA} />
          <StyledValue ml="6px">{tokenIn?.toSignificant(6)}</StyledValue>
        </RowFixed>
      </RowBetween>

      <RowBetween>
        <StyledTitle>{currencyB.symbol} Deposited:</StyledTitle>
        <RowFixed>
          <CurrencyLogo currency={currencyB} />
          <StyledValue ml="6px">{tokenOut?.toSignificant(6)}</StyledValue>
        </RowFixed>
      </RowBetween>
      <AutoColumn gap="8px">
        <RowBetween>
          <StyledTitle>
            <Trans>Rates:</Trans>
          </StyledTitle>
          <Text>{`1 ${currencyA?.symbol} = ${price ? formatTransactionAmount(priceToPreciseFloat(price)) : '-'} ${currencyB?.symbol}`}</Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <Text>{`1 ${currencyB?.symbol} = ${price?.invert().toSignificant(4)} ${currencyA?.symbol}`}</Text>
        </RowBetween>
      </AutoColumn>
      <RowBetween>
        <StyledTitle>
          <Trans>Share of Pool:</Trans>
        </StyledTitle>
        <Text>
          <Trans>{noLiquidity ? '100' : poolTokenPercentage?.toFixed(2)}%</Trans>
        </Text>
      </RowBetween>

      <Box background={RoboTheme.colors.stroke} height="1px" mt="20px" />

      <Grid gridTemplateColumns="repeat(2, auto)">
        <IconButton height="100% !important" scale="lg" onClick={onDismiss}>
          <RowCenter height="100%">
            <Text fontWeight={600} fontSize="16px" gradient={RoboTheme.colors.gradients.primary}>
              <Trans>Cancel</Trans>
            </Text>
          </RowCenter>
        </IconButton>
        <Button scale="lg" onClick={onAdd}>
          <Text fontWeight={600} fontSize="16px">
            {noLiquidity ? <Trans>Create Pool & Supply</Trans> : <Trans>Confirm Supply</Trans>}
          </Text>
        </Button>
      </Grid>
    </>
  );
};
export default ConfirmAddModalBottom;
